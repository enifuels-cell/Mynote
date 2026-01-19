<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Note extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'rich_content',
        'tags',
        'ai_summary',
        'ai_tags',
        'ai_category',
        'is_pinned',
        'is_archived',
        'is_secure',
        'color',
        'reminder_date',
        'reminder_message',
        'is_reminder_recurring',
        'reminder_pattern',
        'device_id',
        'version',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tags' => 'array',
        'ai_tags' => 'array',
        'rich_content' => 'array',
        'is_pinned' => 'boolean',
        'is_archived' => 'boolean',
        'is_secure' => 'boolean',
        'is_reminder_recurring' => 'boolean',
        'reminder_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the user that owns the note.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the attachments for the note.
     */
    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    /**
     * Get the voice note for this note.
     */
    public function voiceNote()
    {
        return $this->hasOne(VoiceNote::class);
    }

    /**
     * Scope to get only active (non-deleted) notes.
     */
    public function scopeActive($query)
    {
        return $query->where('deleted_at', null);
    }

    /**
     * Scope to filter by user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by tags.
     */
    public function scopeByTag($query, $tag)
    {
        return $query->whereJsonContains('tags', $tag);
    }

    /**
     * Scope to search notes.
     */
    public function scopeSearch($query, $searchTerm)
    {
        return $query->where(function($q) use ($searchTerm) {
            $q->where('title', 'like', '%' . $searchTerm . '%')
              ->orWhere('content', 'like', '%' . $searchTerm . '%')
              ->orWhereJsonContains('tags', $searchTerm);
        });
    }
}
