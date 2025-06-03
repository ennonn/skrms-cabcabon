<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PendingProfilesReminder extends Notification implements ShouldQueue
{
    use Queueable;

    protected $pendingCount;

    public function __construct(int $pendingCount)
    {
        $this->pendingCount = $pendingCount;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Reminder: Pending Youth Profiles')
            ->line("You have {$this->pendingCount} pending youth profile" . ($this->pendingCount > 1 ? 's' : '') . " awaiting review.")
            ->action('Review Pending Profiles', route('youth-profiles.pending.index'))
            ->line('Please review these profiles to keep the system up to date.');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'pending_profiles_reminder',
            'message' => "You have {$this->pendingCount} pending youth profile" . ($this->pendingCount > 1 ? 's' : '') . " awaiting review",
            'pending_count' => $this->pendingCount,
            'action_url' => route('youth-profiles.pending.index'),
        ];
    }
} 