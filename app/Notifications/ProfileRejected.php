<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProfileRejected extends Notification
{
    use Queueable;

    protected $notes;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $notes = null)
    {
        $this->notes = $notes;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Your youth profile has been rejected.' . 
                ($this->notes ? ' Reason: ' . $this->notes : ''),
            'type' => 'profile_rejected'
        ];
    }
} 