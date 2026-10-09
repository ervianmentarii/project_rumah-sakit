<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tariff;
use Illuminate\Http\Request;

class TariffController extends Controller
{
    public function index(Request $request)
    {
        $query = Tariff::query();
        
        if ($request->search) $query->where('nama_tarif', 'like', "%{$request->search}%");
        if ($request->kategori) $query->where('kategori', $request->kategori);
        
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_tarif' => 'required|string|unique:tariffs',
            'nama_tarif' => 'required|string',
            'kategori' => 'required|in:konsultasi,tindakan,laboratorium,lainnya',
            'harga' => 'required|numeric|min:0',
            'is_active' => 'boolean'
        ]);

        $tariff = Tariff::create($validated);
        return response()->json($tariff, 201);
    }

    public function show($id)
    {
        return response()->json(Tariff::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $tariff = Tariff::findOrFail($id);
        
        $validated = $request->validate([
            'kode_tarif' => 'string|unique:tariffs,kode_tarif,' . $id,
            'nama_tarif' => 'string',
            'kategori' => 'in:konsultasi,tindakan,laboratorium,lainnya',
            'harga' => 'numeric|min:0',
            'is_active' => 'boolean'
        ]);

        $tariff->update($validated);
        return response()->json($tariff);
    }

    public function destroy($id)
    {
        $tariff = Tariff::findOrFail($id);
        $tariff->delete();
        return response()->json(['message' => 'Tariff deleted successfully']);
    }
}
