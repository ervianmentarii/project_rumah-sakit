<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('tariffs', function (Blueprint $table) {
            $table->id();
            $table->string('kode_tarif')->unique();
            $table->string('nama_tarif');
            $table->enum('kategori', ['konsultasi', 'tindakan', 'laboratorium', 'lainnya']);
            $table->decimal('harga', 12, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('tariffs'); }
};
