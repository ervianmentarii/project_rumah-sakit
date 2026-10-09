<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'admin',
            'resepsionis',
            'perawat',
            'dokter',
            'kasir',
            'apoteker'
        ];

        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }
    }
}
