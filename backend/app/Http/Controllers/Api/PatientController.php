<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $query = Patient::latest();
        
        if ($search = $request->search) {
            $query->where('nama', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('no_rm', 'like', "%{$search}%");
        }

        $perPage = $request->input('per_page', 15);
        
        if ($perPage == -1) {
            return response()->json(['data' => $query->get()]);
        }

        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required|string|size:16|unique:patients',
            'nama' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string',
            'no_telepon' => 'required|string',
            'golongan_darah' => 'nullable|string',
            'alergi' => 'nullable|string'
        ]);

        $patient = Patient::create($validated);
        return response()->json($patient, 201);
    }

    public function show($id)
    {
        $patient = Patient::with('queues')->findOrFail($id);
        return response()->json($patient);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        
        $validated = $request->validate([
            'nik' => 'string|size:16|unique:patients,nik,' . $id,
            'nama' => 'string',
            'tanggal_lahir' => 'date',
            'jenis_kelamin' => 'in:L,P',
            'alamat' => 'string',
            'no_telepon' => 'string',
            'golongan_darah' => 'nullable|string',
            'alergi' => 'nullable|string'
        ]);

        $patient->update($validated);
        return response()->json($patient);
    }
}
