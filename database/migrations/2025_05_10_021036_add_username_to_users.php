<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        // First add the column as nullable temporarily
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->after('name');
        });

        // Generate and set unique usernames for all existing users
        $users = DB::table('users')->select('id', 'name')->get();
        $existingUsernames = [];

        foreach ($users as $user) {
            $baseUsername = Str::slug($user->name, '_');
            $username = $baseUsername;
            $counter = 1;

            // Ensure username uniqueness
            while (in_array($username, $existingUsernames)) {
                $username = $baseUsername . '_' . $counter;
                $counter++;
            }

            $existingUsernames[] = $username;

            DB::table('users')
                ->where('id', $user->id)
                ->update(['username' => $username]);
        }

        // Now make the column non-nullable
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('username');
        });
    }
};
