<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Events\PaymentCompleted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['patient', 'queue', 'items'])->latest();
        
        if ($search = $request->search) {
            $query->whereHas('patient', function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%");
            })->orWhereHas('queue', function($q) use ($search) {
                $q->where('no_antrian', 'like', "%{$search}%");
            })->orWhere('kode_transaksi', 'like', "%{$search}%");
        }

        if ($status = $request->status_pembayaran) {
            $query->where('status_pembayaran', $status);
        }

        if ($request->input('per_page') == -1) {
            return response()->json($query->get());
        }

        return response()->json($query->paginate(15));
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'queue_id' => 'required|exists:queues,id',
            'metode_pembayaran' => 'required|in:tunai,qris,transfer',
            'items' => 'required|array|min:1',
            'items.*.deskripsi' => 'required|string',
            'items.*.jumlah' => 'required|integer|min:1',
            'items.*.harga_satuan' => 'required|numeric|min:0',
            'items.*.tipe' => 'required|in:tindakan,obat,konsultasi,lainnya',
        ]);

        $transaction = DB::transaction(function () use ($validated) {
            $totalBiayaTindakan = 0;
            $totalBiayaObat = 0;
            $totalKeseluruhan = 0;

            foreach ($validated['items'] as $item) {
                $subtotal = $item['jumlah'] * $item['harga_satuan'];
                $totalKeseluruhan += $subtotal;
                if ($item['tipe'] === 'tindakan') $totalBiayaTindakan += $subtotal;
                if ($item['tipe'] === 'obat') $totalBiayaObat += $subtotal;
            }

            $trx = Transaction::create([
                'patient_id' => $validated['patient_id'],
                'queue_id' => $validated['queue_id'],
                'total_biaya_tindakan' => $totalBiayaTindakan,
                'total_biaya_obat' => $totalBiayaObat,
                'total_keseluruhan' => $totalKeseluruhan,
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'status_pembayaran' => 'belum_bayar',
            ]);

            foreach ($validated['items'] as $item) {
                $subtotal = $item['jumlah'] * $item['harga_satuan'];
                $trx->items()->create(array_merge($item, ['subtotal' => $subtotal]));
            }

            return $trx->load('items');
        });

        return response()->json($transaction, 201);
    }

    public function show($id)
    {
        return response()->json(Transaction::with(['items', 'patient', 'queue'])->findOrFail($id));
    }

    public function getByQueue($queueId)
    {
        return response()->json(Transaction::with('items')->where('queue_id', $queueId)->first());
    }

    public function updatePaymentStatus(Request $request, $id)
    {
        $transaction = Transaction::with('queue')->findOrFail($id);
        $request->validate([
            'status_pembayaran' => 'required|in:belum_bayar,menunggu_konfirmasi,lunas,gagal,refund',
            'metode_pembayaran' => 'nullable|in:tunai,qris,transfer'
        ]);
        
        $data = ['status_pembayaran' => $request->status_pembayaran];
        if ($request->has('metode_pembayaran')) {
            $data['metode_pembayaran'] = $request->metode_pembayaran;
        }

        if ($request->status_pembayaran === 'lunas') {
            $data['paid_at'] = now();
        }

        $transaction->update($data);

        if ($request->status_pembayaran === 'lunas') {
            // Ubah status antrean jadi selesai setelah bayar lunas
            if ($transaction->queue) {
                $transaction->queue->update(['status' => 'selesai']);
                try {
                    broadcast(new \App\Events\QueueUpdated($transaction->queue))->toOthers();
                } catch (\Exception $e) {}
            }
            try {
                broadcast(new PaymentCompleted($transaction))->toOthers();
            } catch (\Exception $e) {}
        }

        return response()->json($transaction);
    }

    // Midtrans logic has been moved to PaymentController
}
