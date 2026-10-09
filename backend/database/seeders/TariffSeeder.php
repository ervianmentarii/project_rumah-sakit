<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tariff;

class TariffSeeder extends Seeder
{
    public function run(): void
    {
        $tariffs = [
            [
                'kode_tarif' => 'TRF001',
                'nama_tarif' => 'Konsultasi Dokter Umum',
                'kategori' => 'konsultasi',
                'harga' => 50000,
                'is_active' => true
            ],
            [
                'kode_tarif' => 'TRF002',
                'nama_tarif' => 'Cek Darah Lengkap',
                'kategori' => 'laboratorium',
                'harga' => 150000,
                'is_active' => true
            ],
            [
                'kode_tarif' => 'TRF003',
                'nama_tarif' => 'Tindakan Jahit Luka Kecil',
                'kategori' => 'tindakan',
                'harga' => 100000,
                'is_active' => true
            ]
        ];

        foreach ($tariffs as $tariff) {
            Tariff::create($tariff);
        }
    }
}
