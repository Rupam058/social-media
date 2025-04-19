<?php

namespace App\Services;

use App\Models\Like;

class LikeService {
    public function createLike(string $userId, string $postId): Like|null {
        // First Check if like exists or not
        $like = Like::query()
            ->where("user_id", $userId)
            ->where("post_id", $postId)
            ->first();

        // Like exits, so we need to remove it
        if ($like != null) {
            return null;
        }

        // Like does not exist, so we need to create it
        return Like::create([
            "user_id" => $userId,
            "post_id" => $postId
        ]);
    }

    public function getLikeCount(string $postId): int {
        $likeCount = Like::where("post_id", $postId)->count();
        return $likeCount;
    }

    public function userLikesPost(string $userId, string $postId) {
        $like = Like::where("post_id", $postId)
            ->where("user_id", $userId)
            ->first();

        $likeId = $like != null ? $like->id : null;
        return $likeId;
    }

    public function deleteLike(string $userId, string $likeId): bool {
        $like = Like::query()
            ->where("user_id", $userId)
            ->where('id', $likeId)
            ->first();

        if ($like == null) {
            return false;
        }

        $like->delete();
        return true;
    }
}
