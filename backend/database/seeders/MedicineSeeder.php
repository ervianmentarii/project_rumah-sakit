<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medicine;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        $medicines = [
            [
                'kode_obat' => 'OBT001',
                'nama_obat' => 'Paracetamol 500mg',
                'satuan' => 'Tablet',
                'kategori' => 'Analgesik',
                'harga' => 5000,
                'stok' => 100,
                'stok_minimum' => 20,
                'is_active' => true
            ],
            [
                'kode_obat' => 'OBT002',
                'nama_obat' => 'Amoxicillin 500mg',
                'satuan' => 'Kapsul',
                'kategori' => 'Antibiotik',
                'harga' => 10000,
                'stok' => 50,
                'stok_minimum' => 10,
                'is_active' => true
            ],
            [
                'kode_obat' => 'OBT003',
                'nama_obat' => 'Sirup Obat Batuk Hitam',
                'satuan' => 'Botol',
                'kategori' => 'Ekspektoran',
                'harga' => 15000,
                'stok' => 30,
                'stok_minimum' => 5,
                'is_active' => true
            ]
        ];

        foreach ($medicines as $medicine) {
            Medicine::create($medicine);
        }
    }
}
