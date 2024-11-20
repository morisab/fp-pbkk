<?php

namespace Database\Factories;

use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class MenuItemFactory extends Factory
{
    protected $model = MenuItem::class;

    private $drinkData = [
        ['name' => 'Mystic Mango Fizz', 'description' => 'A refreshing mango-flavored sparkling drink.', 'price' => 25000, 'image_url' => 'https://github.com/user-attachments/assets/c730969f-bb5f-4783-b57e-c23a5341cb8d'],
        ['name' => 'Coconut Dream Delight', 'description' => 'A creamy blend of coconut and milk for a tropical treat.', 'price' => 30000, 'image_url' => 'https://github.com/user-attachments/assets/9216554d-8cf0-4942-98e6-b2bf2845e2cf'],
        ['name' => 'Berry Blast Cooler', 'description' => 'A tangy and sweet mix of various berries with ice.', 'price' => 28000, 'image_url' => 'https://github.com/user-attachments/assets/2156b9c8-da7d-4da8-abfa-82155f720052'],
        ['name' => 'Spicy Ginger Zest', 'description' => 'A bold combination of ginger and citrus for a spicy kick.', 'price' => 22000, 'image_url' => 'https://github.com/user-attachments/assets/45768e46-7624-43f7-b9ba-e3a8e528acea'],
        ['name' => 'Tropical Sunrise', 'description' => 'A colorful mix of tropical fruits with a hint of lime.', 'price' => 32000, 'image_url' => 'https://github.com/user-attachments/assets/79af0c54-e2ff-470a-a4cd-eaf5d06c12c0'],
        ['name' => 'Peachy Paradise', 'description' => 'A smooth peach-flavored drink with a touch of cream.', 'price' => 27000, 'image_url' => 'https://github.com/user-attachments/assets/91a2465c-095b-49cd-93d5-9962156e44b0'],
        ['name' => 'Choco Mint Madness', 'description' => 'Rich chocolate with a refreshing hint of mint.', 'price' => 35000, 'image_url' => 'https://github.com/user-attachments/assets/f2f0ff80-716b-46b8-948a-90f1e84d17cd'],
        ['name' => 'Lavender Lemonade', 'description' => 'A calming mix of lavender and lemonade for a unique twist.', 'price' => 24000, 'image_url' => 'https://github.com/user-attachments/assets/e0255792-82a1-4684-983f-7301695cb26d'],
        ['name' => 'Citrus Burst Spritzer', 'description' => 'A fizzy drink with a mix of orange, lemon, and lime.', 'price' => 21000, 'image_url' => 'https://github.com/user-attachments/assets/0ecc7fb0-f590-4cdf-be8f-ff2781d4a151'],
        ['name' => 'Caramel Macchiato Bliss', 'description' => 'A sweet blend of espresso, caramel, and milk.', 'price' => 44000, 'image_url' => 'https://github.com/user-attachments/assets/670a11e6-46a1-4a2e-a175-6d6e36091a04'],
        ['name' => 'Vanilla Chai Chill', 'description' => 'A spiced chai latte with vanilla syrup, served cold.', 'price' => 39000, 'image_url' => 'https://github.com/user-attachments/assets/799a5208-d1c9-4b05-9964-aac108da1e65'],
        ['name' => 'Matcha Meltdown', 'description' => 'A creamy matcha drink with a strong green tea flavor.', 'price' => 42000, 'image_url' => 'https://github.com/user-attachments/assets/c94bdc8b-ee56-4511-92ae-3f8003ccbb77'],
    ];

    public function definition()
    {
        // Ambil data minuman secara berurutan dari array
        $drink = array_pop($this->drinkData);

        return [
            'name' => $drink['name'],
            'description' => $drink['description'],
            'category' => 'drink',
            'price' => $drink['price'],
            'image_url' => $drink['image_url'],
        ];
    }
}
