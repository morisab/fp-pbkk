<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::factory()->count(5)->create(); // Create 5 users
        User::factory()->admin()->create([
            'name' => 'Budi',
            'email' => 'budi@admin.com',
            'password' => bcrypt('admin'),
        ]);
    }
}
