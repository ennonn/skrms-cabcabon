<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Proposal;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        // Get a user (you can modify this to get a specific user)
        $user = User::first();
        
        if (!$user) {
            return;
        }

        // Example notifications
        $notifications = [
            [
                'id' => Str::uuid(),
                'type' => 'App\Notifications\ProposalApproved',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'message' => 'Your proposal "Youth Leadership Workshop Series" has been approved.',
                    'proposal_id' => 1,
                    'action_url' => '/proposals/1',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\Notifications\ProposalRejected',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'message' => 'Your proposal "Community Outreach Program" has been rejected.',
                    'proposal_id' => 2,
                    'rejection_reason' => 'Budget details need more clarification and itemization.',
                    'action_url' => '/proposals/2',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\Notifications\ProposalApproved',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'message' => 'Your proposal "Mental Health Awareness Campaign" has been approved.',
                    'proposal_id' => 3,
                    'action_url' => '/proposals/3',
                ]),
                'read_at' => now(), // This one is marked as read
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\Notifications\ProposalRejected',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'message' => 'Your proposal "Sports Development Initiative" has been rejected.',
                    'proposal_id' => 4,
                    'rejection_reason' => 'Timeline needs to be more detailed with specific milestones.',
                    'action_url' => '/proposals/4',
                ]),
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
        ];

        foreach ($notifications as $notification) {
            DB::table('notifications')->insert($notification);
        }
    }
} 