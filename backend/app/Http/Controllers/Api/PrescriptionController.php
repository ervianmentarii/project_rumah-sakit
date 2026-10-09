<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use App\Models\PrescriptionItem;
use App\Events\NewPrescription;
use App\Events\PrescriptionStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PrescriptionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'medical_record_id' => 'required|exists:medical_records,id',
            'patient_id' => 'required|exists:patients,id',
            'catatan_dokter' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.medicine_id' => 'required|exists:medicines,id',
            'items.*.jumlah' => 'required|integer|min:1',
            'items.*.dosis' => 'required|string',
            'items.*.aturan_pakai' => 'required|string',
            'items.*.catatan' => 'nullable|string',
        ]);

        $prescription = DB::transaction(function () use ($validated, $request) {
            $pres = Prescription::create([
                'medical_record_id' => $validated['medical_record_id'],
                'patient_id' => $validated['patient_id'],
                'doctor_id' => $request->user()->id,
                'status' => 'pending',
                'catatan_dokter' => $validated['catatan_dokter'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $pres->items()->create($item);
            }

            return $pres->load('items.medicine');
        });

        broadcast(new NewPrescription($prescription))->toOthers();

        return response()->json($prescription, 201);
    }

    public function show($id)
    {
        return response()->json(Prescription::with(['items.medicine', 'patient', 'doctor'])->findOrFail($id));
    }

    public function updateStatus(Request $request, $id)
    {
        $prescription = Prescription::findOrFail($id);
        $request->validate(['status' => 'required|in:pending,diproses,selesai,dibatalkan']);
        
        $prescription->update(['status' => $request->status]);

        broadcast(new PrescriptionStatusUpdated($prescription))->toOthers();

        return response()->json($prescription);
    }

    public function getByMedicalRecord($recordId)
    {
        return response()->json(Prescription::with('items')->where('medical_record_id', $recordId)->first());
    }

    public function getPending()
    {
        return response()->json(Prescription::with(['patient', 'doctor'])->where('status', 'pending')->get());
    }
}
