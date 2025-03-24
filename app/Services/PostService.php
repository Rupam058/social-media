<?php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;
use Exception;
use Illuminate\Support\Str;

class PostService {
    public function getPosts() {
        return Post::all();
    }

    public function createPost(string $caption): Model|array {
        try {
            // First try to find an existing user
            $user = User::first();

            // If no user exists, create one with a unique email
            if (!$user) {
                $uniqueEmail = 'user_' . Str::random(6) . '@example.com';
                $user = User::create([
                    "name" => "Cookie Monster",
                    "email" => $uniqueEmail,
                    "password" => Hash::make("SecurePassword"),
                ]);
            }

            // Create post with explicit user_id assignment
            $post = new Post();
            $post->caption = $caption;
            $post->user_id = $user->id;
            $post->save();

            return $post;
        } catch (Exception $e) {
            return [
                'error' => true,
                'message' => $e->getMessage()
            ];
        }
    }
}
