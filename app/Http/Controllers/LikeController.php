<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateLikeRequest;
use App\Services\LikeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller {
    public function __construct(protected LikeService $likeService) {
    }

    public function createLike(CreateLikeRequest $req) {
        $validated = $req->validated();
        $like = $this->likeService->createLike(userId: Auth::id(), postId: $validated['post_id']);

        if ($like == null) {
            return response()->json([
                "error" => "Like Already Exists"
            ], status: 400);
        } else {
            return $like;
        }
    }

    public function deleteLike(string $id) {
        if ($this->likeService->deleteLike(userId: Auth::id(), likeId: $id)) {
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
