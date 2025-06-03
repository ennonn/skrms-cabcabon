<?php

namespace App\Services;

use App\Models\Records\YouthProfileRecord;
use App\Notifications\ProposalMatchNotification;

class ProposalMatchService
{
    protected $committeeMappings = [
        'Committee on Education and Culture' => [
            'Education Support',
            'Skills & Capacity Building',
            'Cultural aspects of Community Development'
        ],
        'Committee on Environment' => [
            'Community Development & Environment',
            'Social Transformation'
        ],
        'Committee on Youth Employment & Livelihood' => [
            'Skills & Capacity Building',
            'Social Transformation',
            'Advocacy & Governance'
        ],
        'Committee on Sports, Gender, and Development' => [
            'Sports & Recreation',
            'Social Transformation',
            'Community Development & Environment'
        ],
        'Committee on Health' => [
            'Health & Wellness',
            'Community Development & Environment'
        ],
        'Committee on Social Protection' => [
            'Social Transformation',
            'Advocacy & Governance',
            'Health & Wellness'
        ],
        'Committee on Development Projects' => [
            'Community Development & Environment',
            'Skills & Capacity Building'
        ],
        'Committee on Finance, Ways, and Means' => [
            'Advocacy & Governance'
        ]
    ];

    public function findMatchingYouth($proposal)
    {
        $matchingYouth = [];
        $matchedCategories = [];

        // Get all youth profiles
        $youthProfiles = YouthProfileRecord::with('personalInformation')->get();

        foreach ($youthProfiles as $youth) {
            $suggestedPrograms = $youth->personalInformation->suggested_programs ?? [];
            $interests = $youth->personalInformation->interests_hobbies ?? [];

            // Check if any of the youth's interests match the proposal's category
            foreach ($this->committeeMappings as $committee => $categories) {
                if (in_array($proposal->category, $categories)) {
                    // Check if youth's suggested programs or interests match any of the committee's categories
                    foreach ($categories as $category) {
                        if (in_array($category, $suggestedPrograms) || in_array($category, $interests)) {
                            $matchingYouth[] = $youth;
                            $matchedCategories[$youth->id] = $categories;
                            break;
                        }
                    }
                }
            }
        }

        return [
            'youth' => $matchingYouth,
            'categories' => $matchedCategories
        ];
    }

    public function notifyMatchingYouth($proposal)
    {
        $matches = $this->findMatchingYouth($proposal);

        foreach ($matches['youth'] as $youth) {
            if ($youth->personalInformation && $youth->personalInformation->email) {
                \Illuminate\Support\Facades\Mail::to($youth->personalInformation->email)
                    ->send(new \App\Notifications\ProposalMatchNotification(
                        $proposal,
                        $matches['categories'][$youth->id]
                    ));
            }
        }
    }
} 