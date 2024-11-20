<?php

namespace Database\Factories;

use App\Models\LoyaltyProgram;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoyaltyProgramFactory extends Factory
{
    protected $model = LoyaltyProgram::class;

    public function definition()
    {
        return [
            'points' => $this->faker->numberBetween(0, 1000), // Poin acak untuk program loyalitas
            'user_id' => User::inRandomOrder()->first()->id, // Hubungkan dengan user yang sudah ada
        ];
    }
}
