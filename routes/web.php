<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\RedisController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('index');
});

Route::prefix('/auth')->group(function () {
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);

    Route::middleware(('auth:sanctum'))->group(function () {
        Route::post('/logout', [UserController::class, 'logout']);
        Route::get('/user', [UserController::class, 'getUserDetails']);
        Route::post('/password', [UserController::class, 'setPassword']);
    });


    Route::post("/initReset", [UserController::class, 'initResetPassword']);
    Route::get("reset", [UserController::class, 'resetPasswordView'])->name('resetPasswordView');
    Route::post("reset", [UserController::class, 'resetPassword']);

    Route::get("/confirm", [UserController::class, 'confirmEmail'])->name('confirmEmail');

    // First Redirect the user to google for authentication
    Route::get("/redirect/google", [GoogleAuthController::class, 'redirect']);
    // Once done, host them...
    Route::get("/callback/google", [GoogleAuthController::class, 'callback']);
});

Route::prefix('/api')->group(function () {
    Route::prefix('/posts')->group(function () {
        Route::get('/', [PostController::class, 'getPosts']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/', [PostController::class, 'createPost']);
            Route::put('/{id}', [PostController::class, 'updatePost']);
            Route::delete('/{id}', [PostController::class, 'deletePost']);
        });
        Route::get('/{id}/comments', [CommentController::class, 'getPostComments']);
    });

    Route::prefix('/likes')->group(function () {
        Route::post('/', [LikeController::class, 'createLike']);
        Route::delete('/{id}', [LikeController::class, 'deleteLike']);
    });

    Route::prefix('/comments')->group(function () {
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/', [CommentController::class, 'createComment']);
            Route::put('/{id}', [CommentController::class, 'updateComment']);
            Route::delete('/{id}', [CommentController::class, 'deleteComment']);
        });
    });

    Route::prefix('/follows')->group(function () {
        Route::get('/', [FollowController::class, 'getFollows']);
        Route::post('/', [FollowController::class, 'createFollow']);
        Route::get("/following/{toUser}", [FollowController::class, 'getFollow']);
        Route::delete('/{id}', [FollowController::class, 'deleteFollow']);
    });

    Route::get("/user/{username}", [UserController::class, 'getUserByUsername']);
    Route::prefix('/user')->middleware("auth:sanctum")->group(function () {
        Route::post('/name', [UserController::class, 'setName']);
        Route::post('/username', [UserController::class, 'setUserName']);
        Route::post('/avatar', [UserController::class, 'setAvatar']);
        Route::post('/banner', [UserController::class, 'setBanner']);
        Route::post('/description', [UserController::class, 'setDescription']);
    });
});
