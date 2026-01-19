<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClipboardHistory extends Model
{
    use HasFactory;

    protected $table = 'clipboard_histories';

    protected $fillable = [
        'user_id',
        'content',
        'device_id',
        'timestamp',
    ];

    protected $casts = [
        'timestamp' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
