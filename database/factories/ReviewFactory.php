<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition()
    {
        return [
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->sentence,
            'order_id' => Order::inRandomOrder()->first()->id,
        ];
    }
}
