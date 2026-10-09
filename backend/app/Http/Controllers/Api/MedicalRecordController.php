<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use App\Models\Queue;
use App\Events\QueueUpdated;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate request
        $validated = $request->validate([
            'queue_id' => 'required|exists:queues,id',
            'anamnesis' => 'required|string',
            'pemeriksaan_fisik' => 'required|string',
            'diagnosis' => 'required|string',
            'diagnosis_kode' => 'nullable|string',
            'tindakan' => 'nullable|string',
            'catatan' => 'nullable|string',
            'prescriptions' => 'nullable|array'
        ]);

        $queue = Queue::find($validated['queue_id']);
        $validated['patient_id'] = $request->patient_id ?? $queue->patient_id;
        $validated['doctor_id'] = $request->user() ? $request->user()->id : 1;
        $validated['tanggal_periksa'] = now();

        $record = MedicalRecord::create([
            'queue_id' => $validated['queue_id'],
            'patient_id' => $validated['patient_id'],
            'doctor_id' => $validated['doctor_id'],
            'tanggal_periksa' => $validated['tanggal_periksa'],
            'anamnesis' => $validated['anamnesis'],
            'pemeriksaan_fisik' => $validated['pemeriksaan_fisik'],
            'diagnosis' => $validated['diagnosis'],
            'diagnosis_kode' => $validated['diagnosis_kode'] ?? null,
            'tindakan' => $validated['tindakan'] ?? null,
            'catatan' => $validated['catatan'] ?? null,
        ]);
        
        $totalBiayaObat = 0;
        
        // 2. Process Prescriptions if any
        if (!empty($validated['prescriptions'])) {
            $prescription = \App\Models\Prescription::create([
                'medical_record_id' => $record->id,
                'patient_id' => $validated['patient_id'],
                'doctor_id' => $validated['doctor_id'],
                'status' => 'pending'
            ]);

            foreach ($validated['prescriptions'] as $item) {
                // Determine medicine ID and Price
                $medId = is_array($item['medicine']) ? $item['medicine']['value'] : $item['medicine'];
                $medicine = \App\Models\Medicine::find($medId);
                
                if ($medicine) {
                    $prescription->items()->create([
                        'medicine_id' => $medicine->id,
                        'jumlah' => $item['jumlah'],
                        'dosis' => $item['dosis'],
                        'aturan_pakai' => $item['aturan_pakai'] ?? '',
                        'catatan' => ''
                    ]);
                    $totalBiayaObat += ($medicine->harga * $item['jumlah']);
                }
            }

            try {
                broadcast(new \App\Events\NewPrescription($prescription))->toOthers();
            } catch (\Exception $e) {}
        }
        
        // 3. Auto-generate Transaction for Cashier (Consultation Fee + Medicines)
        $transaction = \App\Models\Transaction::create([
            'patient_id' => $validated['patient_id'],
            'queue_id' => $validated['queue_id'],
            'total_biaya_tindakan' => 50000,
            'total_biaya_obat' => $totalBiayaObat,
            'total_keseluruhan' => 50000 + $totalBiayaObat,
            'metode_pembayaran' => 'tunai', // Default, kasir will change this
            'status_pembayaran' => 'belum_bayar',
        ]);
        
        // Add consultation fee item
        $transaction->items()->create([
            'deskripsi' => 'Konsultasi Dokter',
            'jumlah' => 1,
            'harga_satuan' => 50000,
            'subtotal' => 50000,
            'tipe' => 'konsultasi',
        ]);

        // Add medicine items
        if (!empty($validated['prescriptions'])) {
            foreach ($validated['prescriptions'] as $item) {
                $medId = is_array($item['medicine']) ? $item['medicine']['value'] : $item['medicine'];
                $medicine = \App\Models\Medicine::find($medId);
                if ($medicine) {
                    $transaction->items()->create([
                        'deskripsi' => $medicine->nama_obat,
                        'jumlah' => $item['jumlah'],
                        'harga_satuan' => $medicine->harga,
                        'subtotal' => $medicine->harga * $item['jumlah'],
                        'tipe' => 'obat',
                    ]);
                }
            }
        }
        
        $queue->update(['status' => 'periksa']);
        
        try {
            broadcast(new QueueUpdated($queue))->toOthers();
        } catch (\Exception $e) {}

        return response()->json($record, 201);
    }

    public function show($id)
    {
        $record = MedicalRecord::with(['patient', 'doctor', 'queue.triage', 'prescription'])->findOrFail($id);
        return response()->json($record);
    }

    public function getByPatient($patientId)
    {
        $records = MedicalRecord::where('patient_id', $patientId)->orderBy('tanggal_periksa', 'desc')->get();
        return response()->json($records);
    }

    public function getByQueue($queueId)
    {
        $record = MedicalRecord::where('queue_id', $queueId)->firstOrFail();
        return response()->json($record);
    }
}
