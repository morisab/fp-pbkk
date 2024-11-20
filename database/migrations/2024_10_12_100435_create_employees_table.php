<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id(); // auto-incrementing primary key
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('address');
            $table->string('shift');
            $table->timestamps(); // timestamps untuk created_at dan updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('employees');
    }
};
