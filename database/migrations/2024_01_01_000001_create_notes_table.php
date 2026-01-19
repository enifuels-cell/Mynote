<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->longText('content')->nullable();
            $table->json('rich_content')->nullable();
            $table->json('tags')->nullable();
            $table->longText('ai_summary')->nullable();
            $table->json('ai_tags')->nullable();
            $table->string('ai_category')->nullable();
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_archived')->default(false);
            $table->boolean('is_secure')->default(false);
            $table->string('color')->default('#ffffff');
            $table->timestamp('reminder_date')->nullable();
            $table->string('reminder_message')->nullable();
            $table->boolean('is_reminder_recurring')->default(false);
            $table->string('reminder_pattern')->nullable();
            $table->string('device_id')->nullable();
            $table->integer('version')->default(1);
            $table->softDeletes();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('created_at');
            $table->index('deleted_at');
            $table->index(['user_id', 'deleted_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
