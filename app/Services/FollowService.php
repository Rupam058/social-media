<?php

namespace App\Services;

use App\Models\Follow;

class FollowService {
    public function getFollowsFrom(string $userId) {
        return Follow::query()
            ->where("from_id", $userId)
            ->get();
    }

    public function createFollow(string $fromId, String $toId): Follow {
        return Follow::create([
            "from_id" => $fromId,
            "to_id" => $toId
        ]);
    }

    public function deleteFollow(string $fromId, string $toId): bool {
        $follow = Follow::find([
            "from_id" => $fromId,
            "to_id" => $toId
        ])->first();

        if ($follow == null) {
            return false;
        }

        $follow->delete();
        return true;
    }
}
