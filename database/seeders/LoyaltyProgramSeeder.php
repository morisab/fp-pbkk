<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LoyaltyProgram;
use App\Models\User;

class LoyaltyProgramSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        foreach ($users as $user) {
            LoyaltyProgram::factory()->create([
                'user_id' => $user->id, // Link loyalty program to the corresponding user
            ]);
        }
    }
}
