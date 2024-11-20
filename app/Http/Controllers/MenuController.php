<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        $menuItems = MenuItem::all(); // Ambil semua item menu
        return response()->json($menuItems); // Kembalikan dalam format JSON
    }

    public function show($id)
    {
        $menuItem = MenuItem::find($id); // Cari item menu berdasarkan ID
        
        if (!$menuItem) {
            return response()->json(['message' => 'Menu item not found'], 404); // Kembalikan pesan jika item menu tidak ditemukan
        }

        return response()->json($menuItem); // Kembalikan item menu dalam format JSON
    }

    public function store(Request $request)
    {
        $request->validate([ // Validasi input
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string|max:1000',
            'category' => 'nullable|string|max:255',
        ]);

        $menuItem = MenuItem::create([ // Buat item menu baru
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'category' => $request->category,
        ]);

        return response()->json(['message' => 'Menu item created successfully!', 'menu_item' => $menuItem], 201); // Kembalikan pesan sukses
    }

    public function update(Request $request, $id)
    {
        $request->validate([ // Validasi input
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'description' => 'sometimes|nullable|string|max:1000',
            'category' => 'sometimes|nullable|string|max:255',
        ]);

        $menuItem = MenuItem::find($id); // Cari item menu berdasarkan ID
        if (!$menuItem) {
            return response()->json(['message' => 'Menu item not found'], 404); // Kembalikan pesan jika item menu tidak ditemukan
        }

        $menuItem->update($request->only(['name', 'price', 'description', 'category'])); // Update item menu
        return response()->json(['message' => 'Menu item updated successfully!', 'menu_item' => $menuItem]); // Kembalikan pesan sukses
    }

    public function destroy($id)
    {
        $menuItem = MenuItem::find($id); // Cari item menu berdasarkan ID
        if (!$menuItem) {
            return response()->json(['message' => 'Menu item not found'], 404); // Kembalikan pesan jika item menu tidak ditemukan
        }

        $menuItem->delete(); // Hapus item menu
        return response()->json(['message' => 'Menu item deleted successfully!']); // Kembalikan pesan sukses
    }
}