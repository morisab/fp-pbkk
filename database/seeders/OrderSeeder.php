<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;
use App\Models\Employee;

class OrderSeeder extends Seeder
{
    public function run()
    {
        // Create 10 orders with user and employee relationships
        Order::factory()
            ->count(10)
            ->create([
                'user_id' => User::inRandomOrder()->first()->id, // Randomly assign a user
                'employee_id' => Employee::inRandomOrder()->first()->id, // Randomly assign an employee
            ]);
    }
}
