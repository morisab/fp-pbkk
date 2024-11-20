<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        $name = $this->faker->name;
        $email = strtolower(str_replace(' ', '.', $name)) . '@example.com';

        return [
            'name' => $name,
            'email' => $email,
            'password' => bcrypt('password'), // Default password
        ];
    }
    
    public function admin()
    {
        return $this->state([
            'is_admin' => true,
        ]);
    }
}
