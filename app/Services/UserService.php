<?php

namespace App\Services;

use App\Http\Responses\UserMeta;
use App\Mail\ConfirmEmail;
use App\Mail\ResetPassword;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\URL;

class UserService {
    public function register(string $email, string $password) {
        $normalizedEmail = strtolower($email);
        $user = $this->getUserByEmail($normalizedEmail);

        if ($user != null)
            return false;

        // Generate a username based on the email
        $username = $this->generateUsername($normalizedEmail);

        $user = User::create([
            "email" => $normalizedEmail,
            "name" => 'Cooler User',
            "username" => $username,
            "auth_type" => "password",
            "password" => Hash::make($password),
            "description" => "not coolest user ever"
        ]);

        Mail::to($user)->send(new ConfirmEmail(
            URL::signedRoute("confirmEmail", ["token" => $user->id])
        ));

        return true;
    }

    public function confirmEmail(string $userId) {
        $user = $this->getUserById($userId);
        if ($user == null)
            return;

        $user->markEmailAsVerified();
        $user->save();
    }

    public function initResetPassword(string $email) {
        $user = $this->getUserByEmail($email);
        if ($user == null)
            return;

        Mail::to($user)->send(new ResetPassword(
            URL::signedRoute(
                'resetPasswordView',
                ['token' => $user->id]
            )
        ));
    }

    public function resetPassword(string $userId, string $password) {
        $user = $this->getUserById(($userId));
        if ($user == null)
            return;

        $user->password = Hash::make($password);
        $user->save();

        return response('Password reset successfully, you can now log In')->json([
            'message' => 'Password reset successfully'
        ]);
    }

    public function setPassword(string $userId, string $previous, string $new): bool {
        $user = $this->getUserById($userId);
        if ($user == null)
            return false;
        if (!Hash::check($previous, $user->getAuthPassword()))
            return false;

        $user->password = Hash::make($new);
        $user->save();
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
    public function getUserByUsername(string $username): User | null {
        return User::query()
            ->where("username", $username)
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

        $this->updateCachedMeta($user);
    }

    public function setUserDescription(string $user, string $description) {
        $user = $this->getUserById($user);
        if ($user == null) {
            return;
        }

        $user->description = $description;
        $user->save();
    }

    public function setUserBanner(string $user, string $banner) {
        $user = $this->getUserById($user);
        if ($user == null) {
            return;
        }

        $user->banner = $banner;
        $user->save();

        $this->updateCachedMeta($user);
    }
    private function updateCachedMeta(User $user) {
        $meta = $this->userMetaFromUser($user);
        Redis::set($this->userMetaCatcheKey($user->id), json_encode($meta->toJson()));
    }


    private function userMetaFromUser(User $user): UserMeta {
        return new UserMeta(
            id: $user->id,
            username: $user->username,
            name: $user->name,
            avatar: $user->avatar,
            banner: $user->banner,
        );
    }

    public function getUserMetaById(string $id): UserMeta | null {
        $cached = Redis::get($this->userMetaCatcheKey($id));
        if ($cached != null) {
            return $cached != "null" ? UserMeta::fromJson(json_decode($cached, true)) : null;
        }

        $user = $this->getUserById($id);
        if ($user == null) {
            Redis::set($this->userMetaCatcheKey($id), "null");
            return null;
        }

        $meta = $this->userMetaFromUser($user);
        Redis::set($this->userMetaCatcheKey($id), json_encode($meta->toJson()));
        return $meta;
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

        // Generate a username based on the email
        $username = $this->generateUsername($email);

        return User::create([
            "email" => $normalizedEmail,
            "name" => $email,
            "auth_type" => $provider,
            "username" => $username,
            "password" => "",
            "description" => "",
        ]);
    }

    private function userMetaCatcheKey(string $id) {
        return "user_meta_$id";
    }

    /**
     * Generate a unique username based on email
     */
    private function generateUsername(string $email): string {
        // Extract part before @ in email
        $baseUsername = explode('@', $email)[0];

        // Clean up the username (remove special chars, etc)
        $baseUsername = preg_replace('/[^a-zA-Z0-9]/', '', $baseUsername);

        // Check if username exists
        $username = $baseUsername;
        $counter = 1;

        while ($this->getUserByUsername($username) !== null) {
            // If username exists, append a number
            $username = $baseUsername . $counter;
            $counter++;
        }

        return $username;
    }
}
