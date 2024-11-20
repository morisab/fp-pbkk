<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Order;

class ReviewSeeder extends Seeder
{
    public function run()
    {
        $orders = Order::all();

        foreach ($orders as $order) {
            Review::factory()->create([
                'order_id' => $order->id, // Link review to the corresponding order
            ]);
        }
    }
}
