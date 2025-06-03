<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProposalAttachment extends Model
{
    protected $fillable = [
        'proposal_id',
        'filename',
        'original_filename',
        'mime_type',
        'path',
        'size',
    ];

    protected $appends = ['url'];

    public function proposal(): BelongsTo
    {
        return $this->belongsTo(Proposal::class);
    }

    public function getUrlAttribute(): string
    {
        return Storage::url($this->path);
    }
} 