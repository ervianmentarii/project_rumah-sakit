<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PatientCalled implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $queue;

    public function __construct($queue)
    {
        $this->queue = $queue;
    }

    public function broadcastOn()
    {
        return new Channel('display-channel');
    }

    public function broadcastAs()
    {
        return 'PatientCalled';
    }

    public function broadcastWith()
    {
        return ['queue' => $this->queue];
    }
}
