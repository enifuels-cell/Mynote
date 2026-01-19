<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'username',
        'password',
        'theme',
        'default_view',
        'ai_auto_organize',
        'auto_sync',
        'is_email_verified',
        'last_login',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_email_verified' => 'boolean',
        'ai_auto_organize' => 'boolean',
        'auto_sync' => 'boolean',
        'last_login' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the notes for the user.
     */
    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    /**
     * Get the biometric credentials for the user.
     */
    public function biometricCredentials()
    {
        return $this->hasMany(BiometricCredential::class);
    }

    /**
     * Get the devices for the user.
     */
    public function devices()
    {
        return $this->hasMany(Device::class);
    }

    /**
     * Get the clipboard history for the user.
     */
    public function clipboardHistory()
    {
        return $this->hasMany(ClipboardHistory::class);
    }
}
