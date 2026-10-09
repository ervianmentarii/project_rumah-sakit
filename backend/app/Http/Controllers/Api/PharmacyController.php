<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PharmacyController extends Controller
{
    public function pendingPrescriptions()
    {
        // Return pending, diproses, and today's selesai prescriptions
        $prescriptions = Prescription::with(['items.medicine', 'patient', 'doctor'])
            ->whereIn('status', ['pending', 'diproses'])
            ->orWhere(function($query) {
                $query->where('status', 'selesai')
                      ->whereDate('updated_at', now()->toDateString());
            })
            ->get();
            
        return response()->json($prescriptions);
    }

    public function processPrescription($id)
    {
        $prescription = Prescription::findOrFail($id);
        $prescription->update(['status' => 'diproses']);
        
        return response()->json($prescription);
    }

    public function completePrescription($id)
    {
        $prescription = Prescription::with('items.medicine')->findOrFail($id);
        
        DB::transaction(function () use ($prescription) {
            foreach ($prescription->items as $item) {
                $medicine = $item->medicine;
                if ($medicine->stok < $item->jumlah) {
                    throw new \Exception("Stok obat {$medicine->nama_obat} tidak mencukupi");
                }
                $medicine->decrement('stok', $item->jumlah);
            }
            $prescription->update(['status' => 'selesai']);
        });

        return response()->json($prescription);
    }

    public function cancelPrescription($id)
    {
        $prescription = Prescription::findOrFail($id);
        $prescription->update(['status' => 'dibatalkan']);
        return response()->json($prescription);
    }

    public function prescriptionHistory(Request $request)
    {
        $query = Prescription::with(['items.medicine', 'patient', 'doctor'])
            ->whereIn('status', ['selesai', 'dibatalkan']);
            
        return response()->json($query->paginate(15));
    }
}
