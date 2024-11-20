<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition()
    {
        $name = $this->faker->name;
        $email = strtolower(str_replace(' ', '.', $name)) . '@example.com';

        return [
            'name' => $name,
            'email' => $email,
            'phone' => $this->faker->phoneNumber,
            'address' => $this->faker->address,
            'shift' => $this->faker->randomElement(['Pagi', 'Siang', 'Malam']),
        ];
    }
}
