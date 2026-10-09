<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('queue-channel', function ($user) {
    return true; // Everyone can listen to queue updates
});

Broadcast::channel('pharmacy-channel', function ($user) {
    return $user->hasRole('apoteker') || $user->hasRole('admin');
});

Broadcast::channel('doctor-channel.{doctorId}', function ($user, $doctorId) {
    return (int) $user->id === (int) $doctorId;
});

Broadcast::channel('cashier-channel', function ($user) {
    return $user->hasRole('kasir') || $user->hasRole('admin');
});

Broadcast::channel('display-channel', function ($user) {
    return true;
});
