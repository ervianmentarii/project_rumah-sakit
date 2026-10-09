<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'no_antrian', 'tanggal', 'status', 'poli'
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->no_antrian)) {
                $lastQueue = self::where('poli', $model->poli)
                    ->whereDate('tanggal', $model->tanggal)
                    ->orderBy('id', 'desc')
                    ->first();
                
                $lastNumber = 0;
                if ($lastQueue && preg_match('/\d+$/', $lastQueue->no_antrian, $matches)) {
                    $lastNumber = (int) $matches[0];
                }
                
                $nextNumber = $lastNumber + 1;
                $prefix = strtoupper(substr($model->poli, 0, 1));
                if (empty($prefix)) $prefix = 'A';
                
                $model->no_antrian = $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    public function scopeToday($query)
    {
        return $query->whereDate('tanggal', now()->toDateString());
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function triage()
    {
        return $this->hasOne(Triage::class);
    }

    public function medicalRecord()
    {
        return $this->hasOne(MedicalRecord::class);
    }

    public function transaction()
    {
        return $this->hasOne(Transaction::class);
    }
}
