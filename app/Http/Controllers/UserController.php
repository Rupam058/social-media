<?php

namespace App\Http\Controllers;

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

        return response()->json(["error" => "error occured"]);
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
}
