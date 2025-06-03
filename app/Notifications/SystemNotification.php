namespace App\Notifications;

class SystemNotification extends BaseNotification
{
    public static function maintenanceMode(bool $enabled): self
    {
        $status = $enabled ? 'enabled' : 'disabled';
        return new self(
            "System maintenance mode has been {$status}.",
            'maintenance_mode'
        );
    }

    public static function systemUpdate(string $version): self
    {
        return new self(
            "System has been updated to version {$version}.",
            'system_update'
        );
    }

    public static function backupCompleted(): self
    {
        return new self(
            'System backup has been completed successfully.',
            'backup_completed'
        );
    }

    public static function securityAlert(string $message): self
    {
        return new self(
            "Security Alert: {$message}",
            'security_alert'
        );
    }

    public static function customNotification(string $message, string $type = 'info'): self
    {
        return new self($message, $type);
    }
} 