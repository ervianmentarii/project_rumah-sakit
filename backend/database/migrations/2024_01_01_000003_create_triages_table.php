<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('triages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('queue_id')->constrained('queues')->onDelete('cascade');
            $table->foreignId('nurse_id')->constrained('users')->onDelete('cascade');
            $table->string('tekanan_darah')->nullable();
            $table->decimal('suhu', 5, 2)->nullable();
            $table->integer('nadi')->nullable();
            $table->integer('pernapasan')->nullable();
            $table->decimal('berat_badan', 5, 2)->nullable();
            $table->decimal('tinggi_badan', 5, 2)->nullable();
            $table->text('keluhan_utama');
            $table->text('riwayat_penyakit')->nullable();
            $table->text('catatan_perawat')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('triages'); }
};
