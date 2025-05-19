<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use \Illuminate\Support\Str;

class UpdateExistingUsersWithusername extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        User::whereNull('username')->each(function ($user) {
            // Create a base username from the user's name
            $baseUsername = Str::slug($user->name, '_');

            // Check if this username already exists
            $count = 0;
            $username = $baseUsername;

            // Keep adding a number suffix until we find a unique username
            while (User::where('username', $username)->where('id', '!=', $user->id)->exists()) {
                $count++;
                $username = $baseUsername . '_' . $count;
            }

            // Update the user with the unique username
            $user->username = $username;
            $user->save();

            $this->command->info("User ID {$user->id} updated with username: {$username}");
        });
    }
}
