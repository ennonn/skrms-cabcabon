namespace App\Notifications;

class YouthProfileNotification extends BaseNotification
{
    public static function profileSubmitted(): self
    {
        return new self(
            'Your youth profile has been submitted for review.',
            'profile_submitted'
        );
    }

    public static function profileApproved(): self
    {
        return new self(
            'Your youth profile has been approved.',
            'profile_approved'
        );
    }

    public static function profileRejected(string $reason = ''): self
    {
        $message = 'Your youth profile has been rejected.';
        if ($reason) {
            $message .= " Reason: {$reason}";
        }
        return new self($message, 'profile_rejected');
    }

    public static function profileUpdated(): self
    {
        return new self(
            'Your youth profile has been updated successfully.',
            'profile_updated'
        );
    }

    // For admins
    public static function newProfileSubmission(string $name): self
    {
        return new self(
            "New youth profile submission from {$name}.",
            'new_profile_submission'
        );
    }
} 