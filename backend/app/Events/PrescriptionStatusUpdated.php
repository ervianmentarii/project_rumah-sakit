<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PrescriptionStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $prescription;

    public function __construct($prescription)
    {
        $this->prescription = $prescription;
    }

    public function broadcastOn()
    {
        return new Channel('doctor-channel.' . $this->prescription->doctor_id);
    }

    public function broadcastAs()
    {
        return 'PrescriptionStatusUpdated';
    }

    public function broadcastWith()
    {
        return ['prescription' => $this->prescription];
    }
}
