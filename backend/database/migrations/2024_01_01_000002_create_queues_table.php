<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('queues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->string('no_antrian');
            $table->date('tanggal');
            $table->enum('status', ['menunggu', 'triase', 'periksa', 'selesai', 'batal']);
            $table->string('poli');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('queues'); }
};
