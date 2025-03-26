<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserService {
    public function register(string $email, string $password) {
        $normalizedEmail = strtolower($email);
        $user = User::query()->where("email", $normalizedEmail)->first();

        if ($user != null)
            return false;

        User::create([
            "email" => $normalizedEmail,
            "name" => 'Cooler User',
            "password" => Hash::make($password),
            "description" => "not coolest user ever"
        ]);

        return true;
    }

    public function login(string $email, string $password) {
        try {
            $normalizedEmail = strtolower($email);

            // Check if user exists
            $user = User::where('email', $normalizedEmail)->first();

            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'User not found'
                ];
            }

            // Attempt authentication
            if (Auth::attempt([
                "email" => $normalizedEmail,
                "password" => $password
            ])) {
                return [
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => Auth::user()
                ];
            }

            return [
                'success' => false,
                'message' => 'Invalid credentials'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'An error occurred during login',
                'error' => $e->getMessage()
            ];
        }
    }
}
