<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'no_rm', 'nik', 'nama', 'tanggal_lahir', 'jenis_kelamin', 
        'alamat', 'no_telepon', 'golongan_darah', 'alergi'
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->no_rm)) {
                $date = now()->format('Ymd');
                $last = self::whereDate('created_at', now()->toDateString())->count() + 1;
                $model->no_rm = 'RM-' . $date . '-' . str_pad($last, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    public function queues()
    {
        return $this->hasMany(Queue::class);
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
