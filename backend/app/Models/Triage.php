<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Triage extends Model
{
    use HasFactory;

    protected $fillable = [
        'queue_id', 'nurse_id', 'tekanan_darah', 'suhu', 'nadi', 
        'pernapasan', 'berat_badan', 'tinggi_badan', 'keluhan_utama', 
        'riwayat_penyakit', 'catatan_perawat'
    ];

    protected $casts = [
        'suhu' => 'decimal:2',
        'berat_badan' => 'decimal:2',
        'tinggi_badan' => 'decimal:2',
    ];

    public function queue()
    {
        return $this->belongsTo(Queue::class);
    }

    public function nurse()
    {
        return $this->belongsTo(User::class, 'nurse_id');
    }
}
