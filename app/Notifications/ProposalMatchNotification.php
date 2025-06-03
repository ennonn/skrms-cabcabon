<?php

namespace App\Notifications;

use App\Models\Proposal;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProposalMatchNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $proposal;
    protected $matchedCategories;

    /**
     * Create a new notification instance.
     */
    public function __construct(Proposal $proposal, array $matchedCategories)
    {
        $this->proposal = $proposal;
        $this->matchedCategories = $matchedCategories;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('New Program Matches Your Interests!')
            ->greeting('Hello ' . $notifiable->full_name . '!')
            ->line('A new program has been approved that matches your interests:')
            ->line('')
            ->line('Title: ' . $this->proposal->title)
            ->line('Category: ' . $this->proposal->category->name)
            ->line('Description: ' . $this->proposal->description)
            ->line('')
            ->line('Implementation Period:')
            ->line('Start Date: ' . $this->proposal->implementation_start_date)
            ->line('End Date: ' . $this->proposal->implementation_end_date)
            ->line('')
            ->line('Location: ' . $this->proposal->location)
            ->line('')
            ->line('This program aligns with your suggested programs and interests. We encourage you to get involved!');

        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            'proposal_id' => $this->proposal->id,
            'proposal_title' => $this->proposal->title,
            'matched_categories' => $this->matchedCategories,
            'type' => 'proposal_match'
        ];
    }
} 