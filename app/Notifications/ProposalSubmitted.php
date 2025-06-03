<?php

namespace App\Notifications;

use App\Models\Proposal;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProposalSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    protected $proposal;

    /**
     * Create a new notification instance.
     */
    public function __construct(Proposal $proposal)
    {
        $this->proposal = $proposal;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Proposal Submitted')
            ->greeting('Hello Admin,')
            ->line('A new proposal has been submitted and requires your review.')
            ->line('Title: ' . $this->proposal->title)
            ->line('Category: ' . $this->proposal->category->name)
            ->line('Submitted By: ' . $this->proposal->submitter->first_name . ' ' . $this->proposal->submitter->last_name)
            ->action('Review Proposal', route('proposals.pending'))
            ->line('Thank you for your attention to this matter.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'proposal_id' => $this->proposal->id,
            'title' => $this->proposal->title,
            'type' => 'proposal_submitted',
            'message' => 'New proposal submitted: ' . $this->proposal->title,
            'action_url' => route('proposals.pending')
        ];
    }
}
