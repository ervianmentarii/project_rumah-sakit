<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'doctor_id', 'queue_id', 'tanggal_periksa', 
        'anamnesis', 'pemeriksaan_fisik', 'diagnosis', 'diagnosis_kode', 
        'tindakan', 'catatan'
    ];

    protected $casts = [
        'tanggal_periksa' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function queue()
    {
        return $this->belongsTo(Queue::class);
    }

    public function prescription()
    {
        return $this->hasOne(Prescription::class);
    }
}
