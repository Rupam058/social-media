<?php

namespace App\Services;

use App\Models\Comment;
use App\Models\Like;

class CommentService {
    public function createComment(string $userId, string $postId, string $content) {
        Comment::create([
            "user_id" => $userId,
            "post_id" => $postId,
            "content" => $content
        ]);

        return $this->getPostComments($postId);
    }

    public function getPostComments(string $postId) {
        return Comment::where("post_id", $postId)->orderBy('created_at', 'desc')->get();
    }

    public function updateComment(string $userId, string $commentId, string $content): Comment | null {
        $comment = Comment::find([
            "user_id" => $userId,
            "id" => $commentId,
        ])->first();

        if ($comment == null) {
            return null;
        }

        $comment->content = $content;
        $comment->save();
        return $comment;
    }

    public function deleteComment(string $userId, string $commentId): bool {
        $comment = Comment::find([
            "user_id" => $userId,
            "id" => $commentId,
        ])->first();

        if ($comment == null) {
            return false;
        }

        $comment->delete();
        return true;
    }
}
