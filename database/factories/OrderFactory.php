<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        return [
            'total_amount' => $this->faker->numberBetween(10000, 500000),
            'order_date' => $this->faker->dateTimeThisMonth,
            'status' => $this->faker->randomElement(['pending', 'paid']),
            'employee_id' => Employee::inRandomOrder()->first()->id,
            'user_id' => User::inRandomOrder()->first()->id,
        ];
    }
}