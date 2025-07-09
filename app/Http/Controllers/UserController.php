<?php

namespace App\Http\Controllers;

use App\Http\Responses\ProfileResponse;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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

    public function confirmEmail(Request $req, Request $token) {
        // if (!$req->hasValidSignature()) {
        //     abort(401);
        // }

        // $validated = $req->validate([
        //     "token" => "required"
        // ]);

        $userId = $token;
        $this->userService->confirmEmail($userId);
        return response("Successfully confirmed Email, thank You!");
    }

    public function setUserName(Request $req) {
        $username = $req->getContent();
        if ($username == null) {
            return response()->json(["error" => "Username is empty"], status: 400);
        }

        $result = $this->userService->setUserName(userId: Auth::id(), newUsername: $username);

        if (!$result['success']) {
            return response()->json(["error" => $result['message']], status: 400);
        }

        return response()->json([
            "message" => "Username Set",
            "username" => $result['username']
        ], status: 201);
    }


    public function setName(Request $req) {
        $name = $req->getContent();
        if ($name == null) {
            return response()->json(["error" => "Name is empty"], status: 400);
        }

        $this->userService->setName(user: Auth::id(), name: $name);

        return response()->json(["message" => "Name Set"], status: 201);
    }

    public function setAvatar(Request $req) {
        $req->validate([
            "image" => "file|mimes:jpeg,png,jpg,gif,svg|max:2048"
        ]);

        $user = Auth::user();

        // Delete previous banner if it exists
        if ($user && $user->avatar) {
            Storage::disk('public')->delete('avatars/' . $user->avatar);
        }

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

        // Get current user
        $user = Auth::user();

        // Delete previous banner if it exists
        if ($user && $user->banner) {
            Storage::disk('public')->delete('banners/' . $user->banner);
        }

        $image = $req->file("image");
        if (!$image->isValid()) {
            return;
        }

        if (!$image->store("banners", "public")) {
            return;
        }

        $hash = $image->hashName();
        $this->userService->setUserBanner(user: Auth::id(), banner: $hash);

        return response($hash);
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
            Auth::guard("web")->logout();

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
            "name" => $user->name,
            "email" => $user->email,
            "username" => $user->username,
            "avatar" => $user->avatar
        ]);
    }

    public function initResetPassword(Request $req) {
        $validated = $req->validate([
            "email" => "required"
        ]);

        $this->userService->initResetPassword($validated["email"]);

        return response()->json([
            'success' => true,
            'message' => 'If the email exists in our system, a password reset link has been sent.'
        ]);
    }

    public function resetPasswordView(Request $token) {
        // if (!$request->hasValidSignature()) {
        //     abort(401);
        // }

        // $tokenIs = $request->query($token);
        return view('reset_password', ['token' => $token]);
    }

    public function resetPassword(Request $req, $token) {
        // if (!$req->hasValidSignature()) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Invalid or expired password reset link.'
        //     ], 401);
        // }

        $validated = $req->validate([
            // "token" => "required",
            "password" => "required"
        ]);

        $userId = $token;
        if (!$this->userService->resetPassword($userId, $validated["password"])) {
            return response()->json(["error" => "Password Reset failed, try again..."], status: 401);
        }

        return response("Successfully reset password, you can now log in.");
    }


    public function setPassword(Request $req) {
        $validated = $req->validate([
            "previous" => "required",
            "new" => "required"
        ]);

        if (!$this->userService->setPassword(Auth::id(), $validated["previous"], $validated["new"])) {
            return response()->json(["error" => "Incorrect password"], status: 401);
        }

        return response()->json(["message" => "Password Set"], status: 201);
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
