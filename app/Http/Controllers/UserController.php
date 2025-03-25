<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;

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

        $req->session()->regenerate();

        return response()->json(["message" => "User created"], status: 201);
    }

    public function login(Request $req) {
        $validated = $req->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        if (!$this->userService->login(email: $validated["email"], password: $validated["password"]))
            return response()->json(["error" => "Incorrect password or email"], status: 400);

        return response()->json(["message" => "User Logged In"], status: 201);
    }
}
