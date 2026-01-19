<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'note_id',
        'name',
        'url',
        'type',
        'size',
    ];

    public function note()
    {
        return $this->belongsTo(Note::class);
    }
}
