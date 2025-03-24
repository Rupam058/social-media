<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Services\CommentService;
use Illuminate\Http\Request;

class CommentController extends Controller {
    public function __construct(protected CommentService $commentService) {
    }

    public function createComment(CreateCommentRequest $req) {
        $validated = $req->validated();

        return $this->commentService->createComment(
            userId: '0195b937-5c21-7329-9d86-e756299e6448',
            postId: $validated['post_id'],
            content: $validated['content']
        );
    }

    public function updateComment(UpdateCommentRequest $req, string $id) {
        $validated = $req->validated();

        $comment = $this->commentService->updateComment(
            userId: '0195b937-5c21-7329-9d86-e756299e6448',
            commentId: $id,
            content: $validated['content']
        );

        if ($comment == null) {
            return response()->json([
                "error" => "Comment not found"
            ], status: 404);
        }

        return $comment;
    }

    public function deleteComment(string $id) {
        if ($this->commentService->deleteComment(userId: '0195b937-5c21-7329-9d86-e756299e6448', commentId: $id)) {
            return response()->noContent(status: 200);
        } else {
            return response()->json([
                "error" => "This comment does not exist"
            ], status: 404);
        }
    }
}
