<?php

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/posts', function () {
    $posts = Post::with(['comments', 'user'])->get();
    return response()->json($posts);
});

Route::get('/createUser', function () {
    $user = User::create([
        'name' => 'Cookie Monster',
        'email' => 'cool@gmail.com',
        'password' => Hash::make('securedPassword')
    ]);

    return response()->json($user);
});

Route::get('/createPost', function () {
    $post = new Post([
        "caption" => "I Love cats"
    ]);

    $post->user_id = "0195b937-5c21-7329-9d86-e756299e6448";
    $post->save();

    return response("Created Post");
});

Route::get('/updatePost/{id}', function (Request $req, string $id) {
    $caption = $req->query('caption');
    $post = Post::find($id);
    $post->caption = $caption;
    $post->save();

    return response()->json($post);
});

Route::get('/createComment', function () {
    $comment = Comment::create([
        "post_id" => "0195b938-d981-72d3-9eec-bf7f529aa865",
        "user_id" => "0195b937-5c21-7329-9d86-e756299e6448",
        "content" => "I Agree, cats are the best!"
    ]);

    return response()->json($comment);
});
