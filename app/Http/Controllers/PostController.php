<?php

namespace App\Http\Controllers;

use App\Services\PostService;
use Illuminate\Http\Request;

class PostController extends Controller {
    public function __construct(protected PostService $postService) {
    }

    public function testRoute(Request $request) {
        return "THis still Works!";
    }

    public function createPost(Request $request) {
        $validated = $request->validate([
            "caption" => "required|max:100",
        ]);

        $caption = $validated['caption'];
        return $this->postService->createPost(caption: $caption);
    }

    public function updatePost(Request $req, string $id) {
        return $id;
    }
}
