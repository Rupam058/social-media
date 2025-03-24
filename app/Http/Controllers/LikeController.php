<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateLikeRequest;
use App\Services\LikeService;
use Illuminate\Http\Request;

class LikeController extends Controller {
    public function __construct(protected LikeService $likeService) {
    }

    public function createLike(CreateLikeRequest $req) {
        $validated = $req->validated();
        $like = $this->likeService->createLike(userId: '0195b937-5c21-7329-9d86-e756299e6448', postId: $validated['post_id']);

        if ($like == null) {
            return response()->json([
                "error" => "Like Already Exists"
            ], status: 400);
        } else {
            return $like;
        }
    }

    public function deleteLike(string $id) {
        if ($this->likeService->deleteLike(userId: '0195b937-5c21-7329-9d86-e756299e6448', likeId: $id)) {
            return response()->json([
                "message" => "Like Deleted"
            ], status: 200);
        } else {
            return response()->json([
                "error" => "Like not found"
            ], status: 404);
        }
    }
}
