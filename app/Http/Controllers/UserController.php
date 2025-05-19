<?php

namespace App\Http\Controllers;

use App\Http\Responses\ProfileResponse;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller {
    public function __construct(protected UserService $userService) {
    }

    public function register(Request $req) {
        $validated = $req->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        if (!$this->userService->register(email: $validated["email"], password: $validated["password"]))
            return response()->json(["error" => "User already exists"], status: 400);

        return response()->json(["message" => "User created"], status: 201);
    }

    public function setAvatar(Request $req) {
        $req->validate([
            "image" => "file|mimes:jpeg,png,jpg,gif,svg|max:2048"
        ]);

        $image = $req->file("image");
        if (!$image->isValid()) {
            return;
        }

        if (!$image->store("avatars", "public")) {
            return;
        }

        $hash = $image->hashName();
        if ($this->userService->setUserAvatar(user: Auth::id(), avatar: $hash)) {
            return response()->json(["message" => "Avatar Set"], status: 201);
        };

        return response($hash);
    }

    public function setDescription(Request $req) {
        $description = $req->getContent();
        if ($description == null) {
            return response()->json(["error" => "Description is empty"], status: 400);
        }

        $this->userService->setUserDescription(user: Auth::id(), description: $description);

        return response()->json(["message" => "Description Set"], status: 201);
    }

    public function setBanner(Request $req) {
        $req->validate([
            "image" => "required|file|mimes:jpeg,png,jpg,gif,svg|max:2048"
        ]);

        $image = $req->file("image");
        if (!$image->isValid()) {
            return;
        }

        if (!$image->store("banners", "public")) {
            return;
        }

        $hash = $image->hashName();
        $this->userService->setUserBanner(user: Auth::id(), banner: $hash);

        return response()->json(["message" => "Banner Set"], status: 201);
    }

    public function login(Request $req) {
        $validated = $req->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        if (!$this->userService->login(email: $validated["email"], password: $validated["password"]))
            return response()->json(["error" => "Incorrect password or email"], status: 401);

        $req->session()->regenerate();

        return response()->json(["message" => "User Logged In"], status: 201);
    }

    public function logout() {
        try {
            // Logout the user
            Auth::logout();

            return response()->json([
                'message' => 'Successfully logged out'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Logout failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserDetails() {
        $user = Auth::user();

        if ($user == null) {
            return response('Unauthorized', status: 401);
        }

        return response()->json([
            "email" => $user->email,
            "username" => $user->username,
            "avatar" => $user->avatar
        ]);
    }

    public function getUserByUsername(string $username) {
        $user = $this->userService->getUserByUsername($username);
        if ($user == null) {
            return response()->json(["error" => "User not found"], status: 404);
        }

        return response()->json(new ProfileResponse(
            id: $user->id,
            username: $user->username,
            name: $user->name,
            avatar: $user->avatar,
            description: $user->description,
            banner: $user->banner,
        ));
    }
}
