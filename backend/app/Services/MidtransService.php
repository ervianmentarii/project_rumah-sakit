<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
        
        // Disable SSL verification for local development (Windows cURL issue)
        // Also add CURLOPT_HTTPHEADER to prevent PHP 8 'Undefined array key 10023' error in Midtrans SDK
        Config::$curlOptions = [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_HTTPHEADER => [],
        ];
    }

    public function getSnapToken($transactionDetails, $customerDetails)
    {
        if (empty(Config::$serverKey)) {
            // Fallback mock token untuk testing UI jika env belum diisi
            return 'mock_snap_token_' . time();
        }

        $params = [
            'transaction_details' => $transactionDetails,
            'customer_details' => $customerDetails,
            'enabled_payments' => [
                'gopay',
                'shopeepay',
                'other_qris'
            ]
        ];

        return Snap::getSnapToken($params);
    }
}
