<?php

namespace App\Services;

use App\Models\Post;

class PostService {
    public function getPosts() {
        return Post::paginate(25);
    }

    public function createPost(string $userId, string $caption, string | null $image): Post {
        return Post::create([
            "caption" => $caption,
            "user_id" => $userId,
            "image" => $image
        ]);
    }

    public function updatePost(string $userId, string $id, string $caption): Post|null {
        $post = Post::find([
            "id" => $id,
            "user_id" => $userId,
        ])->first();

        if ($post == null) {
            return null;
        }

        $post->caption = $caption;
        $post->save();
        return $post;
    }

    public function deletePost(string $userId, string $postId): bool {
        $post = Post::query()
            ->where("user_id", $userId)
            ->where("id", $postId)
            ->first();

        if ($post == null) {
            return false;
        }

        $post->delete();
        return true;
    }
}
