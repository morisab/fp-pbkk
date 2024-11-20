<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Order;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition()
    {
        return [
            'quantity' => $this->faker->numberBetween(1, 5),
            'order_id' => Order::inRandomOrder()->first()->id,
            'menu_id' => MenuItem::inRandomOrder()->first()->id,
        ];
    }
}
