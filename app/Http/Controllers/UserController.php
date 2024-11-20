<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index()
    {
        // Mengambil semua pengguna
        $users = User::all();
        return response()->json($users);
    }

    public function show($id)
    {
        // Menampilkan pengguna berdasarkan ID
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Membuat pengguna baru
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password), // Password di-hash
        ]);

        return response()->json(['message' => 'User created successfully!', 'user' => $user], 201);
    }

    public function update(Request $request, $id)
    {
        // Validasi input
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$id,
            'password' => 'sometimes|required|string|min:8|confirmed',
        ]);

        // Mencari pengguna
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Update pengguna
        $user->name = $request->input('name', $user->name);
        $user->email = $request->input('email', $user->email);
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password); // Update password
        }
        $user->save();

        return response()->json(['message' => 'User updated successfully!', 'user' => $user]);
    }

    public function destroy($id)
    {
        // Mencari pengguna
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Menghapus pengguna
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
