<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->cascadeOnDelete();
            $table->string('order_id')->unique(); // ID unik untuk dikirim ke Midtrans
            $table->string('midtrans_transaction_id')->nullable();
            $table->decimal('gross_amount', 12, 2);
            $table->string('payment_type')->nullable(); // Misal: 'qris'
            $table->string('status')->default('pending'); // pending, settlement, expire, cancel
            $table->string('snap_token')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
