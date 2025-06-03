<?php

namespace App\Notifications;

use App\Models\Records\PendingYouthProfile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewYouthProfileImported extends Notification implements ShouldQueue
{
    use Queueable;

    protected $profile;

    public function __construct(PendingYouthProfile $profile)
    {
        $this->profile = $profile;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Youth Profile Imported')
            ->line('A new youth profile has been imported through Zapier.')
            ->line('Name: ' . $this->profile->full_name)
            ->line('Age: ' . $this->profile->age)
            ->line('Address: ' . $this->profile->address)
            ->action('Review Profile', route('youth-profiles.pending.show', $this->profile->id))
            ->line('Please review and approve or reject this profile.');
    }

    public function toArray($notifiable): array
    {
        return [
            'profile_id' => $this->profile->id,
            'full_name' => $this->profile->full_name,
            'type' => 'youth_profile_imported',
            'message' => 'New youth profile imported through Zapier',
            'action_url' => route('youth-profiles.pending.show', $this->profile->id),
        ];
    }
} 