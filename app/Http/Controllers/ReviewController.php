<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, $orderId)
    {
        // Validasi input
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:255',
        ]);
    
        // Temukan pesanan berdasarkan ID
        $order = Order::findOrFail($orderId);
    
        // Pastikan order hanya dapat direview satu kali
        if ($order->review) {
            return response()->json(['message' => 'Order already reviewed.'], 400);
        }
    
        // Buat review baru
        $review = Review::create([
            'rating' => $request->input('rating'),
            'comment' => $request->input('comment'),
            'order_id' => $order->id,
        ]);
    
        return response()->json($review, 201);
    }
    
    public function update(Request $request, $orderId)
    {
        // Validasi input
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:255',
        ]);
    
        // Temukan pesanan berdasarkan ID
        $order = Order::findOrFail($orderId);
    
        // Pastikan order sudah direview
        if (!$order->review) {
            return response()->json(['message' => 'Order not reviewed yet.'], 400);
        }
    
        // Update review
        $order->review->update([
            'rating' => $request->input('rating'),
            'comment' => $request->input('comment'),
        ]);
    
        return response()->json($order->review, 200);
    }

    public function destroy($orderId)
    {
        // Temukan pesanan berdasarkan ID
        $order = Order::findOrFail($orderId);
    
        // Pastikan order sudah direview
        if (!$order->review) {
            return response()->json(['message' => 'Order not reviewed yet.'], 400);
        }
    
        // Hapus review
        $order->review->delete();
    
        return response()->json(['message' => 'Review deleted successfully'], 200);
    }

    public function show($orderId)
    {
        // Temukan pesanan berdasarkan ID
        $order = Review::findOrFail($orderId);
        return response()->json($order->review, 200);
    }

    public function index()
    {
        $reviews = Review::all();
        return response()->json($reviews, 200);
    }
}
