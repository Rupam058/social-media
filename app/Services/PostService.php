<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PostService {
    public function createPost(string $caption) {
        $user = User::create([
            "name" => "Cookie Monster",
            "email" => "coolkid@gmail.com",
            "password" => Hash::make("SecurePassword"),
            "description" => "I am the Coolest"
        ]);
    }
}
