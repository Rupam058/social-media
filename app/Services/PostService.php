<?php

namespace App\Services;

use App\Http\Responses\PaginatedResponse;
use App\Http\Responses\PostResponse;
use App\Models\Post;

class PostService {

    private LikeService $likeService;

    public function __construct(LikeService $likeService) {
        $this->likeService = $likeService;
    }

    public function getPosts(string|null $userId) {
        $paginator =  Post::orderBy('created_at', 'desc')
            ->paginate(5);

        $posts = [];
        foreach ($paginator->items() as $post) {
            array_push($posts, new PostResponse(
                post: $post,
                likes: $this->likeService->getLikeCount($post->id),
                comments: 0,
                liked: $userId != null ? $this->likeService->userLikesPost($userId, $post->id) : null
            ));
        }

        return new PaginatedResponse(
            data: $posts,
            current_page: $paginator->currentPage(),
            last_page: $paginator->lastPage()
        );
    }

    public function createPost(string $userId, string $caption, string | null $image): PostResponse {
        return new PostResponse(post: Post::create([
            "user_id" => $userId,
            "caption" => $caption,
            "image" => $image,
        ]), likes: 0, comments: 0, liked: null);
    }

    public function updatePost(string $userId, string $id, string $caption): Post|null {
        $post = Post::find([
            "id" => $id,
            "user_id" => $userId,
        ])->first();

        if ($post == null) {
            return null;
        }

        $post->caption = $caption;
        $post->save();
        return $post;
    }

    public function deletePost(string $userId, string $postId): bool {
        $post = Post::query()
            ->where("user_id", $userId)
            ->where("id", $postId)
            ->first();

        if ($post == null) {
            return false;
        }

        $post->delete();
        return true;
    }
}
