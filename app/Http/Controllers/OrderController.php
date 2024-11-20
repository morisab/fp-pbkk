<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\LoyaltyProgram;
use App\Models\MenuItem;

class OrderController extends Controller
{
    public function createOrder(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'order_items' => 'required|array',
        ]);

        // Hitung total_amount berdasarkan item yang dipesan
        $totalAmount = 0;
        foreach ($request->order_items as $item) {
            $menuItem = MenuItem::findOrFail($item['menu_id']);
            $totalAmount += $menuItem->price * $item['quantity'];
        }

        $order = Order::create([
            'user_id' => $request->user_id,
            'total_amount' => $totalAmount,
            'order_date' => now(),
            'status' => 'pending',
            'employee_id' => null, // Set setelah konfirmasi admin
        ]);

        foreach ($request->order_items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'menu_id' => $item['menu_id'],
                'quantity' => $item['quantity'],
            ]);
        }

        // Update loyalty program
        $loyaltyProgram = LoyaltyProgram::where('user_id', $request->user_id)->first();
        if ($loyaltyProgram) {
            $loyaltyProgram->points += $totalAmount / 1000; // Asumsikan 1 poin per Rp. 1000
            $loyaltyProgram->save();
        }

        return response()->json(['message' => 'Order created successfully', 'order_id' => $order->id], 201);
    }

    public function confirmOrder(Request $request, Order $order)
    {
        // Periksa apakah pengguna adalah admin
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Set employee_id (misalnya, Anda bisa mengisi dengan ID employee yang sedang bertugas)
        $order->employee_id = $request->input('employee_id'); // Anda bisa menerima employee_id dari request jika diperlukan
        $order->status = 'paid'; // Atur status order menjadi completed
        $order->save();

        return response()->json(['message' => 'Order confirmed successfully'], 200);
    }


    public function createPayment(Request $request, Order $order)
    {
        // Validasi input dari pengguna
        $request->validate([
            'payment_method' => 'required|string',
        ]);

        // Cek apakah order sudah dibayar atau belum
        if ($order->status === 'paid') {
            return response()->json(['message' => 'Order sudah dibayar.'], 400);
        }

        // Buat pembayaran menggunakan data dari order
        $payment = Payment::create([
            'amount' => $order->total_amount, // Mengambil total dari order
            'payment_method' => $request->payment_method, // Menggunakan metode pembayaran dari input
            'order_id' => $order->id,
        ]);

        // Mengupdate status order
        $order->save(); // Simpan perubahan status order

        return response()->json(['message' => 'Payment created successfully', 'payment_id' => $payment->id], 201);
    }

    public function createReview(Request $request, Order $order)
    {
        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'comment' => 'string|max:256|nullable',
        ]);

        $order->review()->create([
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Review created successfully'], 201);
    }

    public function getOrderHistory(Request $request)
    {
        // Ambil user_id dari pengguna yang terautentikasi
        $userId = $request->user()->id;

        // Ambil semua pesanan berdasarkan user_id
        $orders = Order::where('user_id', $userId)
            ->with(['orderItems', 'payment', 'review']) // Memuat relasi yang diperlukan
            ->orderBy('order_date', 'desc') // Mengurutkan berdasarkan tanggal pesanan terbaru
            ->get();

        return response()->json($orders, 200);
    }

    public function index ()
    {
        $orders = Order::all();
        return response()->json($orders, 200);
    }

    public function show($orderId)
    {
        $order = Order::findOrFail($orderId);
        return response()->json($order);
    }

    public function update(Request $request, $orderId)
    {
        $order = Order::findOrFail($orderId);

        $request->validate([
            'status' => 'required|string|in:pending,paid',
        ]);

        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order updated successfully'], 200);
    }

    public function destroy($orderId)
    {
        $order = Order::findOrFail($orderId);
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully'], 200);
    }
}
