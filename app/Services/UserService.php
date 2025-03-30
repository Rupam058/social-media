<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserService {
    public function register(string $email, string $password) {
        $normalizedEmail = strtolower($email);
        $user = $this->getUserByEmail($email);

        if ($user != null)
            return false;

        User::create([
            "email" => $normalizedEmail,
            "name" => 'Cooler User',
            "auth_type" => "password",
            "password" => Hash::make($password),
            "description" => "not coolest user ever"
        ]);

        return true;
    }

    public function getUserByEmail(string $email): User | null {
        $normalizedEmail = strtolower($email);
        return User::query()->where("email", $normalizedEmail)->first();
    }
    public function getUserById(string $id): User | null {
        return User::query()
            ->where("id", $id)
            ->first();
    }

    public function login(string $email, string $password) {
        try {
            $normalizedEmail = strtolower($email);

            // Check if user exists
            $user = $this->getUserByEmail($email);

            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'User not found'
                ];
            }

            // Attempt authentication
            if (Auth::attempt([
                "email" => $normalizedEmail,
                "auth_type" => "password",
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

    public function setUserAvatar(string $user, string $avatar) {
        $user = $this->getUserById($user);
        if ($user == null)
            return false;

        $user->avatar = $avatar;
        $user->save();

        return true;
    }

    public function onThirdPartyCallback(string $provider, string $email, string $avatar) {
        $normalizedEmail = strtolower($email);
        $user = $this->getUserByEmail($normalizedEmail);

        // Don't let existing users login/register with a different provider.
        if ($user != null && $user->auth_type != $provider) {
            return false;
        }

        if ($user == null) {
            $user = $this->registerThirdParty($provider, $email, $avatar);
        }
        Auth::login($user);
    }

    public function registerThirdParty(string $provider, string $email, string $avatar): User {
        $normalizedEmail = strtolower($email);

        return User::create([
            "email" => $normalizedEmail,
            "name" => $email,
            "auth_type" => $provider,
            "password" => "",
            "description" => "",
        ]);
    }
}
