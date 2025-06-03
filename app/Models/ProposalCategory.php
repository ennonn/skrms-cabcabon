<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProposalCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function proposals(): HasMany
    {
        return $this->hasMany(Proposal::class);
    }

    public static function getDefaultCategories(): array
    {
        return [
            'Skills & Capacity Building',
            'Community Development & Environment',
            'Social Transformation',
            'Sports & Recreation',
            'Health & Wellness',
            'Education Support',
            'Advocacy & Governance'
        ];
    }
}