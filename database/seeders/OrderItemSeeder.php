<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrderItem;
use App\Models\Order;
use App\Models\MenuItem;

class OrderItemSeeder extends Seeder
{
    public function run()
    {
        // Create OrderItems for each order
        $orders = Order::all();

        foreach ($orders as $order) {
            $menuItems = MenuItem::inRandomOrder()->take(rand(1, 3))->pluck('id'); // Get 1 to 3 random menu items

            foreach ($menuItems as $menuItemId) {
                OrderItem::factory()->create([
                    'order_id' => $order->id,
                    'menu_id' => $menuItemId, // Assign a random menu item to the order
                ]);
            }
        }
    }
}
