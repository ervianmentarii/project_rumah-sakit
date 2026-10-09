<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Queue;
use App\Events\QueueUpdated;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    public function index(Request $request)
    {
        $query = Queue::with('patient')->latest();

        if ($request->tanggal) $query->whereDate('tanggal', $request->tanggal);
        if ($request->status) $query->where('status', $request->status);
        if ($request->poli) $query->where('poli', $request->poli);

        $perPage = $request->input('per_page', 15);
        
        if ($perPage == -1) {
            return response()->json(['data' => $query->get()]);
        }

        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'tanggal' => 'required|date',
            'poli' => 'required|string',
        ]);
        
        $validated['status'] = 'menunggu';
        $queue = Queue::create($validated);

        try {
            broadcast(new QueueUpdated($queue))->toOthers();
        } catch (\Exception $e) {
            // Ignore broadcast error
        }

        return response()->json($queue->load('patient'), 201);
    }

    public function show($id)
    {
        $queue = Queue::with(['patient', 'triage'])->findOrFail($id);
        return response()->json($queue);
    }

    public function updateStatus(Request $request, $id)
    {
        $queue = Queue::findOrFail($id);
        $request->validate(['status' => 'required|in:menunggu,triase,periksa,selesai,batal']);
        
        $queue->update(['status' => $request->status]);

        try {
            broadcast(new QueueUpdated($queue))->toOthers();
        } catch (\Exception $e) {
            // Ignore broadcast error on local dev without reverb running
        }

        return response()->json($queue);
    }

    public function todayQueues()
    {
        $queues = Queue::with('patient')
            ->today()
            ->get()
            ->groupBy('status');
            
        return response()->json($queues);
    }

    public function currentQueue(Request $request)
    {
        $query = Queue::with('patient')
            ->today()
            ->whereIn('status', ['triase', 'periksa']);
            
        if ($request->poli) {
            $query->where('poli', $request->poli);
        }
        
        return response()->json($query->get());
    }
}
