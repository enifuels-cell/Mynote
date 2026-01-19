<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BiometricCredential extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'credential_id',
        'public_key',
        'counter',
        'device_type',
        'backed_up',
        'transports',
    ];

    protected $casts = [
        'backed_up' => 'boolean',
        'transports' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
