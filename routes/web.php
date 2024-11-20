<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', function () {
        return view('layout.home');
    });
});

Route::get('/{any}', function () {
    return view('welcome'); // Ganti dengan nama view Anda
})->where('any', '.*'); // Mengizinkan semua rute
