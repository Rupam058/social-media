<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePostRequest;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller {
    public function __construct(protected PostService $postService) {
    }

    public function getPosts() {
        return $this->postService->getPosts();
    }

    public function createPost(CreatePostRequest $request) {
        $validated = $request->validated();
        $caption = $validated["caption"];

        $post = $this->postService->createPost(userId: Auth::id(), caption: $caption);
        return $post;
    }

    public function updatePost(CreatePostRequest $req, string $id): Post | JsonResponse {
        $validated = $req->validated();
        $caption = $validated['caption'];

        $post = $this->postService->updatePost(userId: Auth::id(), id: $id, caption: $caption);

        if ($post == null) {
            return response()->json([
                "error" => "Post Not found"
            ], status: 404);
        }

        return $post;
    }

    public function deletePost(string $id) {
        if ($this->postService->deletePost(userId: Auth::id(), postId: $id)) {
            return response()->json([
                "message" => "Post Deleted"
            ], status: 200);
        } else {
            return response()->json([
                "error" => "Post not found"
            ], status: 404);
        }
    }
}
