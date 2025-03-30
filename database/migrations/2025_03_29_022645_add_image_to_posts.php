<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        // Disable foreign key constraints
        Schema::disableForeignKeyConstraints();

        // Drop temporary table if it exists from failed migration
        if (Schema::hasTable('posts_new')) {
            Schema::drop('posts_new');
        }

        Schema::create('posts_new', function (Blueprint $table) {
            $table->uuid("id")->primary()->unique();
            $table->string("caption");
            $table->string("image")->nullable();
            $table->foreignUuid("user_id")->constrained("users")->onDelete("cascade");
            $table->timestamps();
        });

        // Copy data from old table to new table
        DB::statement('INSERT INTO posts_new(id, caption, user_id, created_at, updated_at) SELECT id, caption, user_id, created_at, updated_at FROM posts');

        // Drop the old table
        Schema::drop("posts");

        // Rename new table to original name
        Schema::rename('posts_new', 'posts');

        // Re-enable foreign key constraints
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        // Disable foreign key constraints
        Schema::disableForeignKeyConstraints();

        Schema::create('posts_old', function (Blueprint $table) {
            $table->uuid("id")->primary()->unique();
            $table->string("caption");
            $table->foreignUuid("user_id")->constrained("users")->onDelete("cascade");
            $table->timestamps();
        });

        // Copy data back excluding image column
        DB::statement('INSERT INTO posts_old (id, caption, user_id, created_at, updated_at) SELECT id, caption, user_id, created_at, updated_at FROM posts');

        // Drop new version
        Schema::drop('posts');

        // Rename back to original
        Schema::rename('posts_old', 'posts');

        // Re-enable foreign key constraints
        Schema::enableForeignKeyConstraints();
    }
};
