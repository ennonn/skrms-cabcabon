<?php

namespace App\Notifications;

use App\Models\Proposal;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ProposalApproved extends Notification implements ShouldQueue
{
    use Queueable;

    protected $proposal;

    /**
     * Create a new notification instance.
     */
    public function __construct(Proposal $proposal)
    {
        // Eager load the category relationship
        $this->proposal = $proposal->load('category');
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable)
    {
        // For the proposal owner, use my.show route
        if ($notifiable->id === $this->proposal->user_id) {
            $route = route('proposals.my.show', $this->proposal);
        } else {
            // For admins/superadmins, use manage.show route
            $route = route('proposals.manage.show', $this->proposal);
        }

        return [
            'message' => 'Your proposal "' . $this->proposal->title . '" has been approved.',
            'proposal_id' => $this->proposal->id,
            'type' => 'proposal_approved',
            'action_url' => $route
        ];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        // For the proposal owner, use my.show route
        if ($notifiable->id === $this->proposal->user_id) {
            $route = route('proposals.my.show', $this->proposal);
        } else {
            // For admins/superadmins, use manage.show route
            $route = route('proposals.manage.show', $this->proposal);
        }

        $mail = (new MailMessage)
            ->subject('Proposal Approved: ' . $this->proposal->title)
            ->line('Your proposal "' . $this->proposal->title . '" has been approved.');

        if ($this->proposal->committee) {
            $mail->line('Committee: ' . $this->proposal->committee);
        }

        if ($this->proposal->category) {
            $mail->line('Category: ' . $this->proposal->category->name);
        }

        return $mail
            ->action('View Proposal', $route)
            ->line('Thank you for your contribution!');
    }
}
