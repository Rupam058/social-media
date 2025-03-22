<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/posts', [PostController::class, 'getPosts']);
Route::post('/posts', [PostController::class, 'createPost']);
Route::put('/posts/{id}', [PostController::class, 'updatePost']);
Route::delete('/posts/{id}', [PostController::class, 'deletePost']);

Route::post('/likes', [LikeController::class, 'createLike']);
Route::delete('/likes/{id}', [LikeController::class, 'deleteLike']);

Route::put('/comments/{id}', [CommentController::class, 'updateComment']);
Route::delete('/comments/{id}', [CommentController::class, 'deleteComment']);

Route::get('/follows', [FollowController::class, 'getFollows']);
Route::post('/follows', [FollowController::class, 'createFollow']);
Route::delete('/follows/{id}', [FollowController::class, 'deleteFollow']);
