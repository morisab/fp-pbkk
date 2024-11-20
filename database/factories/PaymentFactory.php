<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition()
    {
        return [
            'amount' => $this->faker->numberBetween(10000, 500000),
            'payment_method' => $this->faker->randomElement(['Cash', 'Credit Card', 'Debit Card']),
            'order_id' => Order::inRandomOrder()->first()->id,
        ];
    }
}
