<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePostRequest;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller {
    public function __construct(protected PostService $postService) {
    }

    public function getPosts() {
        return $this->postService->getPosts();
    }

    public function createPost(CreatePostRequest $request) {
        $validated = $request->validated();
        $caption = $validated["caption"];

        $post = $this->postService->createPost(userId: '0195b937-5c21-7329-9d86-e756299e6448', caption: $caption);
        return $post;
    }

    public function updatePost(CreatePostRequest $req, string $id): Post | JsonResponse {
        $validated = $req->validated();
        $caption = $validated['caption'];

        $post = $this->postService->updatePost(userId: '0195b937-5c21-7329-9d86-e756299e6448', id: $id, caption: $caption);

        if ($post == null) {
            return response()->json([
                "error" => "Post Not found"
            ], status: 404);
        }

        return $post;
    }

    public function deletePost(string $id) {
        if ($this->postService->deletePost(userId: '0195b937-5c21-7329-9d86-e756299e6448', postId: $id)) {
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
