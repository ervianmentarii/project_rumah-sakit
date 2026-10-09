<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;
use App\Models\Queue;
use App\Models\Triage;
use App\Models\MedicalRecord;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class DummyDataSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('id_ID');
        
        // Ambil ID staff untuk referensi
        $perawat = User::whereHas('roles', function($q) { $q->where('name', 'perawat'); })->first();
        $dokter = User::whereHas('roles', function($q) { $q->where('name', 'dokter'); })->first();

        // Kosongkan tabel (opsional, karena kita tidak ingin duplikat terus menerus jika di-run ulang)
        // Kita tidak akan truncate agar riwayat asli tidak hilang, hanya tambah data baru

        echo "Creating Dummy Patients...\n";
        
        $patients = [];
        $jenisKelamin = ['L', 'P'];
        $golDarah = ['A', 'B', 'AB', 'O'];
        $polis = ['Poli Umum', 'Poli Anak', 'Poli Gigi', 'Poli Mata'];
        $keluhans = [
            'Demam 3 hari, sakit kepala',
            'Batuk berdahak dan pilek',
            'Sakit gigi bagian bawah belakang',
            'Mata merah dan berair',
            'Pusing berputar (vertigo)',
            'Mual dan muntah sejak semalam',
            'Nyeri perut bagian bawah'
        ];

        DB::beginTransaction();
        try {
            // 1. Buat 15 Pasien
            for ($i = 0; $i < 15; $i++) {
                $patients[] = Patient::create([
                    'nik' => $faker->nik(),
                    'nama' => $faker->name,
                    'tanggal_lahir' => $faker->dateTimeBetween('-50 years', '-5 years')->format('Y-m-d'),
                    'jenis_kelamin' => $faker->randomElement($jenisKelamin),
                    'alamat' => $faker->address,
                    'no_telepon' => '08' . $faker->randomNumber(8, true),
                    'golongan_darah' => $faker->randomElement($golDarah),
                    'alergi' => $faker->boolean(20) ? 'Amoxicillin' : null,
                ]);
            }

            echo "Creating Queues & Medical Records...\n";
            // 2. Buat Antrian hari ini
            foreach ($patients as $index => $patient) {
                // Buat variasi status antrian
                // Index 0-3: menunggu
                // Index 4-6: triase
                // Index 7-9: periksa
                // Index 10-14: selesai
                $status = 'menunggu';
                if ($index >= 4 && $index <= 6) $status = 'triase';
                if ($index >= 7 && $index <= 9) $status = 'periksa';
                if ($index >= 10) $status = 'selesai';

                $queue = Queue::create([
                    'patient_id' => $patient->id,
                    'tanggal' => Carbon::today(),
                    'status' => $status,
                    'poli' => $faker->randomElement($polis),
                ]);

                // 3. Jika status melewati 'menunggu', buat Triase
                if (in_array($status, ['triase', 'periksa', 'selesai'])) {
                    Triage::create([
                        'queue_id' => $queue->id,
                        'nurse_id' => $perawat->id,
                        'tekanan_darah' => $faker->numberBetween(110, 140) . '/' . $faker->numberBetween(70, 90),
                        'suhu' => $faker->randomFloat(1, 36.5, 39.0),
                        'nadi' => $faker->numberBetween(70, 100),
                        'pernapasan' => $faker->numberBetween(18, 24),
                        'berat_badan' => $faker->numberBetween(45, 80),
                        'tinggi_badan' => $faker->numberBetween(150, 180),
                        'keluhan_utama' => $faker->randomElement($keluhans),
                        'catatan_perawat' => 'Pasien tampak lemas',
                    ]);
                }

                // 4. Jika status 'selesai', buat Rekam Medis & Transaksi Lunas
                if ($status === 'selesai') {
                    $rm = MedicalRecord::create([
                        'patient_id' => $patient->id,
                        'doctor_id' => $dokter->id,
                        'queue_id' => $queue->id,
                        'tanggal_periksa' => now(),
                        'anamnesis' => 'Pasien mengeluhkan gejala sejak beberapa hari lalu.',
                        'pemeriksaan_fisik' => 'Compos mentis, tanda vital dalam batas normal kecuali suhu meningkat.',
                        'diagnosis' => 'Observasi Febris / Susp. Infeksi Saluran Akut',
                        'diagnosis_kode' => 'R50.9',
                        'tindakan' => 'Edukasi dan pemberian obat simptomatik',
                    ]);

                    Transaction::create([
                        'patient_id' => $patient->id,
                        'queue_id' => $queue->id,
                        'total_biaya_tindakan' => 50000,
                        'total_biaya_obat' => 75000,
                        'total_keseluruhan' => 125000,
                        'metode_pembayaran' => $faker->randomElement(['tunai', 'qris']),
                        'status_pembayaran' => 'lunas',
                        'paid_at' => now(),
                    ]);
                }
            }
            
            DB::commit();
            echo "Dummy Data Seeded Successfully!\n";
        } catch (\Exception $e) {
            DB::rollBack();
            echo "Error seeding data: " . $e->getMessage() . "\n";
        }
    }
}
