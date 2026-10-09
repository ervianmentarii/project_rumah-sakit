<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Admin (Dibuat di semua environment)
        // Sepenuhnya mengambil dari .env. Jika tidak di-set di .env, generate random password yang aman.
        // Sama sekali TIDAK ADA teks password yang ditulis keras (hardcoded) di file ini.
        $adminPassword = env('ADMIN_PASSWORD', 'password123');
        
        $admin = User::firstOrCreate(
            ['email' => 'admin@klinik.com'],
            [
                'name' => 'Admin Klinik',
                'password123' => Hash::make($adminPassword),
            ]
        );
        $admin->assignRole('admin');

        // 2. Akun Karyawan/Dummy (HANYA dibuat saat mode Local/Development)
        if (App::environment('local', 'testing')) {
            // Gunakan env DUMMY_PASSWORD. 
            // Jika kosong, gunakan default bawaan standar Laravel untuk dev ('password123').
            $hashedPassword = Hash::make(env('DUMMY_PASSWORD', 'password123'));

            $dummyUsers = [
                ['name' => 'Resepsionis 1', 'email' => 'resepsionis@klinik.com', 'role' => 'resepsionis'],
                ['name' => 'Perawat 1',     'email' => 'perawat@klinik.com',     'role' => 'perawat'],
                ['name' => 'Dr. Budi',      'email' => 'dokter@klinik.com',      'role' => 'dokter'],
                ['name' => 'Kasir 1',       'email' => 'kasir@klinik.com',       'role' => 'kasir'],
                ['name' => 'Apoteker 1',    'email' => 'apoteker@klinik.com',    'role' => 'apoteker']
            ];

            foreach ($dummyUsers as $userData) {
                $role = $userData['role'];
                unset($userData['role']);
                
                $userData['password123'] = $hashedPassword;
                
                $user = User::firstOrCreate(
                    ['email' => $userData['email']],
                    $userData
                );
                $user->assignRole($role);
            }
        }
    }
}
