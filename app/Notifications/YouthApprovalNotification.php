<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class YouthApprovalNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $youthName,
        public string $approvalStatus
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $status = $this->approvalStatus === 'approved' ? 'approved' : 'rejected';
        
        $message = (new MailMessage)
            ->subject("Youth Registration {$status}")
            ->greeting("Hello {$this->youthName},");

        if ($this->approvalStatus === 'approved') {
            $message
                ->line('Congratulations! Your youth registration has been approved.')
                ->line('You are now officially part of our barangay youth community. We are excited to have you join us in making a positive impact in our community.')
                ->line('To learn more about upcoming programs and activities, please visit our barangay office. Our youth coordinator will be happy to assist you.')
                ->line('Together, we can create meaningful changes and build a stronger barangay community!');
        } else {
            $message
                ->line('We regret to inform you that your youth registration application could not be approved at this time.')
                ->line('For more information about this decision or to discuss your application further, please visit our barangay office or contact our youth coordinator.');
        }

        return $message
            ->line('Thank you for your interest in being part of our barangay youth community.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'youth_name' => $this->youthName,
            'approval_status' => $this->approvalStatus,
        ];
    }
} 