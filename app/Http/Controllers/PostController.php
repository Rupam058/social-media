<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePostRequest;
use App\Services\PostService;
use Illuminate\Http\Request;

class PostController extends Controller {
    public function __construct(protected PostService $postService) {
    }

    public function testRoute(Request $request) {
        return "THis still Works!";
    }

    public function createPost(CreatePostRequest $request) {
        try {
            $validated = $request->validated();

            $caption = $validated['caption'];
            $result = $this->postService->createPost(caption: $caption);

            if (isset($result['error'])) {
                return response()->json($result, 500);
            }

            return response()->json([
                'message' => 'Post created successfully',
                'data' => $result
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Failed to create post',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function updatePost(Request $req, string $id) {
        return $id;
    }
}
