<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'queue_id', 'kode_transaksi', 'total_biaya_tindakan', 
        'total_biaya_obat', 'total_keseluruhan', 'metode_pembayaran', 
        'status_pembayaran', 'midtrans_order_id', 'midtrans_transaction_id', 
        'snap_token', 'paid_at'
    ];

    protected $casts = [
        'total_biaya_tindakan' => 'decimal:2',
        'total_biaya_obat' => 'decimal:2',
        'total_keseluruhan' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->kode_transaksi)) {
                $date = now()->format('Ymd');
                $last = self::whereDate('created_at', now()->toDateString())->count() + 1;
                $model->kode_transaksi = 'TRX-' . $date . '-' . str_pad($last, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function queue()
    {
        return $this->belongsTo(Queue::class);
    }

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
