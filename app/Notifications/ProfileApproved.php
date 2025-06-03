<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Services\SmsService;

class ProfileApproved extends Notification
{
    use Queueable;

    protected $notes;
    protected $smsService;
    protected $profile;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $notes = null, $profile = null)
    {
        $this->notes = $notes;
        $this->profile = $profile;
        $this->smsService = app(SmsService::class);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $name = $this->profile ? $this->profile->full_name : $notifiable->full_name;
        
        return (new MailMessage)
            ->subject('Youth Registration Approved')
            ->greeting("Hello {$name},")
            ->line('Congratulations! Your youth registration has been approved.')
            ->line('You are now officially part of our barangay youth community. We are excited to have you join us in making a positive impact in our community.')
            ->line('To learn more about upcoming programs and activities, please visit our barangay office. Our youth coordinator will be happy to assist you.')
            ->line('Together, we can create meaningful changes and build a stronger barangay community!')
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
            'message' => 'Your youth profile has been approved.' . 
                ($this->notes ? ' Notes: ' . $this->notes : ''),
            'type' => 'profile_approved'
        ];
    }

    /**
     * Send SMS notification
     */
    public function toSms(object $notifiable)
    {
        $name = $this->profile ? $this->profile->full_name : $notifiable->full_name;
        
        $message = "Hello {$name},\n\n" .
            "Congratulations! Your youth registration has been approved.\n" .
            "You are now officially part of our barangay youth community. We are excited to have you join us in making a positive impact in our community.\n\n" .
            "To learn more about upcoming programs and activities, please visit our barangay office. Our youth coordinator will be happy to assist you.\n\n" .
            "Together, we can create meaningful changes and build a stronger barangay community!\n\n" .
            "Thank you for your interest in being part of our barangay youth community.";

        $phone = $this->profile ? $this->profile->phone : $notifiable->phone_number;
        
        // Format phone number to +63XXXXXXXXXX format
        if ($phone) {
            // Remove any non-digit characters
            $phone = preg_replace('/[^0-9]/', '', $phone);
            
            // If number starts with 09, replace with +63
            if (substr($phone, 0, 2) === '09') {
                $phone = '+63' . substr($phone, 1);
            }
            // If number starts with 9, add +63
            else if (substr($phone, 0, 1) === '9') {
                $phone = '+63' . $phone;
            }
            // If number doesn't start with +63, add it
            else if (substr($phone, 0, 3) !== '+63') {
                $phone = '+63' . $phone;
            }
        }

        return $this->smsService->send($phone, $message);
    }
} 