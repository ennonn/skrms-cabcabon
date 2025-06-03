namespace App\Notifications;

class UserNotification extends BaseNotification
{
    // Role changes
    public static function adminPromotion(): self
    {
        return new self(
            'You have been promoted to admin status.',
            'admin_promotion'
        );
    }

    public static function roleChange(string $newRole): self
    {
        return new self(
            "Your role has been updated to {$newRole}.",
            'role_change'
        );
    }

    // Account related
    public static function accountCreated(): self
    {
        return new self(
            'Your account has been successfully created.',
            'account_created'
        );
    }

    public static function passwordChanged(): self
    {
        return new self(
            'Your password has been changed successfully.',
            'password_changed'
        );
    }

    public static function profileUpdated(): self
    {
        return new self(
            'Your profile has been updated successfully.',
            'profile_updated'
        );
    }
} 