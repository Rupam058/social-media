<?php

namespace App\Http\Responses;

use App\Models\Post;

class PostResponse {
    public Post $post;
    public int $likes;
    public int $comments;
    public string|null $liked;

    public function __construct(Post $post, int $likes, int $comments, string|null $liked) {
        $this->post = $post;
        $this->likes = $likes;
        $this->comments = $comments;
        $this->liked = $liked;
    }
}
