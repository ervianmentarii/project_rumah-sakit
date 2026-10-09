<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Transaction;
use App\Services\MidtransService;
use App\Events\PaymentCompleted;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    public function createQris(Request $request, $transactionId)
    {
        $transaction = Transaction::with('patient')->findOrFail($transactionId);

        // Generate unique order ID for Midtrans
        $orderId = 'QRIS-' . time() . '-' . $transaction->id;

        // Save payment attempt to database
        $payment = Payment::create([
            'transaction_id' => $transaction->id,
            'order_id' => $orderId,
            'gross_amount' => $transaction->total_keseluruhan,
            'payment_type' => 'qris',
            'status' => 'pending'
        ]);

        $transactionDetails = [
            'order_id' => $orderId,
            'gross_amount' => (int) $transaction->total_keseluruhan,
        ];

        $customerDetails = [
            'first_name' => $transaction->patient->nama,
            'phone' => $transaction->patient->no_telepon,
        ];

        try {
            // Get Snap Token via Service
            $snapToken = $this->midtransService->getSnapToken($transactionDetails, $customerDetails);
            
            // Update snap_token in payment
            $payment->update(['snap_token' => $snapToken]);
            
            // For backward compatibility with frontend, also update the transaction
            $transaction->update(['snap_token' => $snapToken]);

            return response()->json(['snap_token' => $snapToken, 'order_id' => $orderId]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function checkStatus($transactionId)
    {
        $transaction = Transaction::with('queue')->findOrFail($transactionId);
        $payment = Payment::where('transaction_id', $transactionId)->where('payment_type', 'qris')->latest()->first();
        
        if (!$payment) {
            return response()->json(['status' => 'pending']);
        }

        try {
            // Because Midtrans\Transaction::status requires Core API, but we are using Snap config, 
            // the curl options we set in MidtransService should apply globally, but we might need to use basic curl here.
            // Actually Midtrans-php has \Midtrans\Transaction::status($orderId) which automatically uses configured keys.
            \Midtrans\Config::$serverKey = env('MIDTRANS_SERVER_KEY');
            \Midtrans\Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
            \Midtrans\Config::$curlOptions = [
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_HTTPHEADER => [],
            ];
            
            $status = \Midtrans\Transaction::status($payment->order_id);
            $transactionStatus = $status->transaction_status;
            
            if ($transactionStatus == 'settlement' || $transactionStatus == 'capture') {
                if ($payment->status !== 'settlement') {
                    $payment->update([
                        'status' => 'settlement',
                        'midtrans_transaction_id' => $status->transaction_id ?? null
                    ]);

                    $transaction->update([
                        'status_pembayaran' => 'lunas',
                        'metode_pembayaran' => 'qris',
                        'paid_at' => now(),
                        'midtrans_transaction_id' => $status->transaction_id ?? null,
                        'midtrans_order_id' => $payment->order_id
                    ]);

                    if ($transaction->queue) {
                        $transaction->queue->update(['status' => 'selesai']);
                    }
                }
                return response()->json(['status' => 'lunas']);
            }
            
            return response()->json(['status' => $transactionStatus]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'pending', 'error' => $e->getMessage()]);
        }
    }

    public function webhook(Request $request)
    {
        $serverKey = env('MIDTRANS_SERVER_KEY');
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);
        
        if ($hashed !== $request->signature_key) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $payment = Payment::where('order_id', $request->order_id)->first();
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $transactionStatus = $request->transaction_status;

        if ($transactionStatus == 'settlement' || $transactionStatus == 'capture') {
            $payment->update([
                'status' => 'settlement',
                'midtrans_transaction_id' => $request->transaction_id
            ]);

            // Mark the linked transaction as paid
            $transaction = $payment->transaction;
            $transaction->update([
                'status_pembayaran' => 'lunas',
                'metode_pembayaran' => 'qris',
                'paid_at' => now(),
                'midtrans_transaction_id' => $request->transaction_id,
                'midtrans_order_id' => $request->order_id
            ]);

            // Update queue status
            if ($transaction->queue) {
                $transaction->queue->update(['status' => 'selesai']);
                try {
                    broadcast(new \App\Events\QueueUpdated($transaction->queue))->toOthers();
                } catch (\Exception $e) {}
            }

            try {
                broadcast(new PaymentCompleted($transaction))->toOthers();
            } catch (\Exception $e) {}
        } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
            $payment->update([
                'status' => $transactionStatus,
                'midtrans_transaction_id' => $request->transaction_id
            ]);
        }

        return response()->json(['message' => 'OK']);
    }
}
