<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Middleware\TestMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('/posts')->group(function () {
    Route::get('/', [PostController::class, 'getPosts']);
    Route::post('/', [PostController::class, 'createPost']);
    Route::put('/{id}', [PostController::class, 'updatePost']);
    Route::delete('/{id}', [PostController::class, 'deletePost']);
});

Route::prefix('/likes')->group(function () {
    Route::post('/', [LikeController::class, 'createLike']);
    Route::delete('/{id}', [LikeController::class, 'deleteLike']);
});

Route::prefix('/comments')->group(function () {
    Route::post('/', [CommentController::class, 'createComment']);
    Route::put('/{id}', [CommentController::class, 'updateComment']);
    Route::delete('/{id}', [CommentController::class, 'deleteComment']);
});

Route::prefix('/follows')->group(function () {
    Route::get('/', [FollowController::class, 'getFollows']);
    Route::post('/', [FollowController::class, 'createFollow']);
    Route::delete('/{id}', [FollowController::class, 'deleteFollow']);
});
