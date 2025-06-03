<?php

namespace App\Notifications;

use App\Models\Proposal;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ProposalRejected extends Notification implements ShouldQueue
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
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable)
    {
        return [
            'proposal_id' => $this->proposal->id,
            'title' => $this->proposal->title,
            'type' => 'proposal_rejected',
            'message' => 'Your proposal "' . $this->proposal->title . '" has been rejected.',
            'rejection_reason' => $this->proposal->rejection_reason,
            'action_url' => route('proposals.show', $this->proposal)
        ];
    }
}
