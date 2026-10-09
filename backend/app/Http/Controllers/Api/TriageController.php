<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Triage;
use App\Models\Queue;
use App\Events\QueueUpdated;
use Illuminate\Http\Request;

class TriageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'queue_id' => 'required|exists:queues,id',
            'tekanan_darah' => 'nullable|string',
            'suhu' => 'nullable|numeric',
            'nadi' => 'nullable|integer',
            'pernapasan' => 'nullable|integer',
            'berat_badan' => 'nullable|numeric',
            'tinggi_badan' => 'nullable|numeric',
            'keluhan_utama' => 'required|string',
            'riwayat_penyakit' => 'nullable|string',
            'catatan_perawat' => 'nullable|string'
        ]);

        $validated['nurse_id'] = $request->user() ? $request->user()->id : 1; // Fallback to admin/first user if auth is bypassed in dev

        $triage = Triage::create($validated);
        
        $queue = Queue::find($validated['queue_id']);
        $queue->update(['status' => 'triase']);
        
        try {
            broadcast(new QueueUpdated($queue))->toOthers();
        } catch (\Exception $e) {
            // Ignore broadcast error on local dev without reverb running
        }

        return response()->json($triage, 201);
    }

    public function show($id)
    {
        return response()->json(Triage::with(['queue', 'nurse'])->findOrFail($id));
    }

    public function getByQueue($queueId)
    {
        return response()->json(Triage::where('queue_id', $queueId)->firstOrFail());
    }
}
