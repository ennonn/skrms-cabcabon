<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ImportCompleted extends Notification implements ShouldQueue
{
    use Queueable;

    protected $status;

    public function __construct(array $status)
    {
        $this->status = $status;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Youth Profile Import Completed')
            ->line('The youth profile import process has been completed.')
            ->line("Total records processed: {$this->status['processed']}")
            ->line("Duplicates found: {$this->status['duplicates']}")
            ->line("Errors encountered: {$this->status['errors']}")
            ->action('View Pending Profiles', route('youth-profiles.pending.index'))
            ->line('Please review the imported profiles and take appropriate action.');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'import_completed',
            'message' => 'Youth profile import completed',
            'status' => $this->status,
            'action_url' => route('youth-profiles.pending.index'),
        ];
    }
} 