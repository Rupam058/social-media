<?php

namespace App\Services;

use App\Models\Like;
use Illuminate\Support\Facades\Redis;

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
        Redis::incr($this->getLikeCountCacheKey($postId));
        $like = Like::create([
            "user_id" => $userId,
            "post_id" => $postId
        ]);

        // Cache the like count
        Redis::set($this->getUserLikeCacheKey($userId, $postId), $like->id);
        return $like;
    }

    public function getLikeCount(string $postId): int {
        // Check if the like count is cached
        $cachedKey = $this->getLikeCountCacheKey($postId);
        $cached = Redis::get($cachedKey);
        if ($cached != null) {
            return (int)$cached;
        }

        $likeCount = Like::where("post_id", $postId)->count();
        // Cache the like count
        Redis::set($cachedKey, $likeCount);

        return $likeCount;
    }

    public function userLikesPost(string $userId, string $postId) {
        // Check if the user has liked the post
        $cachedKey = $this->getUserLikeCacheKey($userId, $postId);
        $cached = Redis::get($cachedKey);
        if ($cached != null) {
            return $cached == "null" ? null : $cached;
        }

        $like = Like::where("post_id", $postId)
            ->where("user_id", $userId)
            ->first();

        $likeId = $like != null ? $like->id : null;
        // Cache the like id
        Redis::set($cachedKey, $likeId != null ? $likeId : "null");
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
        // Decrement the like count
        Redis::decr($this->getLikeCountCacheKey($like->post_id));
        Redis::set($this->getUserLikeCacheKey($userId, $like->post_id), "null");
        return true;
    }

    private function getLikeCountCacheKey(string $postId): string {
        return "like_count_" . $postId;
    }

    private function getUserLikeCacheKey(string $userId, string $postId): string {
        return "user_like_" . $userId . "_" . $postId;
    }
}
