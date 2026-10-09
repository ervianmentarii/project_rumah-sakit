<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$transaction = App\Models\Transaction::latest()->first();

if (!$transaction) {
    echo "No transaction found.\n";
    exit;
}

try {
    $service = new App\Services\MidtransService();
    $token = $service->getSnapToken(
        ['order_id' => 'TEST-' . time(), 'gross_amount' => 10000],
        ['first_name' => 'Budi', 'phone' => '08123456789']
    );
    echo "Token: $token\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
