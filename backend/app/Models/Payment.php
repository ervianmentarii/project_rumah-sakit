<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'order_id',
        'midtrans_transaction_id',
        'gross_amount',
        'payment_type',
        'status',
        'snap_token',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
