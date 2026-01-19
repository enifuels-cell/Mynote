<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VoiceNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'note_id',
        'url',
        'duration',
        'transcript',
    ];

    public function note()
    {
        return $this->belongsTo(Note::class);
    }
}
