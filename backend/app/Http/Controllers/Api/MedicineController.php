<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    public function index(Request $request)
    {
        $query = Medicine::query();

        if ($request->search) {
            $query->where('nama_obat', 'like', "%{$request->search}%")
                  ->orWhere('kode_obat', 'like', "%{$request->search}%");
        }
        if ($request->kategori) {
            $query->where('kategori', $request->kategori);
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_obat' => 'required|string|unique:medicines',
            'nama_obat' => 'required|string',
            'satuan' => 'required|string',
            'kategori' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'stok_minimum' => 'integer|min:0',
            'keterangan' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $medicine = Medicine::create($validated);
        return response()->json($medicine, 201);
    }

    public function show($id)
    {
        return response()->json(Medicine::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $medicine = Medicine::findOrFail($id);
        
        $validated = $request->validate([
            'kode_obat' => 'string|unique:medicines,kode_obat,' . $id,
            'nama_obat' => 'string',
            'satuan' => 'string',
            'kategori' => 'string',
            'harga' => 'numeric|min:0',
            'stok' => 'integer|min:0',
            'stok_minimum' => 'integer|min:0',
            'keterangan' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $medicine->update($validated);
        return response()->json($medicine);
    }

    public function updateStock(Request $request, $id)
    {
        $medicine = Medicine::findOrFail($id);
        $request->validate(['stok' => 'required|integer|min:0']);
        
        $medicine->update(['stok' => $request->stok]);
        return response()->json($medicine);
    }

    public function lowStock()
    {
        return response()->json(Medicine::lowStock()->get());
    }

    public function destroy($id)
    {
        $medicine = Medicine::findOrFail($id);
        $medicine->delete();
        return response()->json(['message' => 'Medicine deleted successfully']);
    }
}
