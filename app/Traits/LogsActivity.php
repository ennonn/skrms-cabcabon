<?php

namespace App\Traits;

use App\Models\Log;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        // Basic CRUD operations
        static::created(function ($model) {
            $model->logActivity('created');
        });

        static::updated(function ($model) {
            $model->logActivity('updated');
        });

        static::deleted(function ($model) {
            $model->logActivity('deleted');
        });
    }

    public function logActivity(string $action, array $additionalDetails = [])
    {
        $log = new Log();
        $log->user_id = auth()->id();
        $log->action = $action;
        $log->model_type = get_class($this);
        $log->model_id = $this->id;
        $log->ip_address = request()->ip();
        $log->user_agent = request()->userAgent();

        // Get the changed attributes for updates
        if ($action === 'updated') {
            $log->old_values = $this->getOriginal();
            $log->new_values = $this->getAttributes();
        }

        // Add any additional details
        if (!empty($additionalDetails)) {
            $log->details = array_merge($log->details ?? [], $additionalDetails);
        }

        $log->save();

        return $log;
    }

    // Helper methods for common actions
    public function logProfileSubmission()
    {
        return $this->logActivity('submitted_profile', [
            'status' => 'pending',
            'submitted_at' => now()->toDateTimeString(),
        ]);
    }

    public function logProfileApproval()
    {
        return $this->logActivity('approved_profile', [
            'approved_by' => auth()->id(),
            'approved_at' => now()->toDateTimeString(),
            'previous_status' => $this->getOriginal('status'),
        ]);
    }

    public function logProfileRejection($reason = null)
    {
        return $this->logActivity('rejected_profile', [
            'rejected_by' => auth()->id(),
            'rejected_at' => now()->toDateTimeString(),
            'reason' => $reason,
            'previous_status' => $this->getOriginal('status'),
        ]);
    }

    public function logProposalSubmission()
    {
        return $this->logActivity('submitted_proposal', [
            'status' => 'pending',
            'submitted_at' => now()->toDateTimeString(),
        ]);
    }

    public function logProposalApproval()
    {
        return $this->logActivity('approved_proposal', [
            'approved_by' => auth()->id(),
            'approved_at' => now()->toDateTimeString(),
            'previous_status' => $this->getOriginal('status'),
        ]);
    }

    public function logProposalRejection($reason = null)
    {
        return $this->logActivity('rejected_proposal', [
            'rejected_by' => auth()->id(),
            'rejected_at' => now()->toDateTimeString(),
            'reason' => $reason,
            'previous_status' => $this->getOriginal('status'),
        ]);
    }

    public function logUserPromotion()
    {
        return $this->logActivity('promoted_user', [
            'promoted_by' => auth()->id(),
            'promoted_at' => now()->toDateTimeString(),
            'previous_role' => $this->getOriginal('role'),
            'new_role' => $this->role,
        ]);
    }

    public function logUserDemotion()
    {
        return $this->logActivity('demoted_user', [
            'demoted_by' => auth()->id(),
            'demoted_at' => now()->toDateTimeString(),
            'previous_role' => $this->getOriginal('role'),
            'new_role' => $this->role,
        ]);
    }

    public function logUserActivation()
    {
        return $this->logActivity('activated_user', [
            'activated_by' => auth()->id(),
            'activated_at' => now()->toDateTimeString(),
        ]);
    }

    public function logUserDeactivation()
    {
        return $this->logActivity('deactivated_user', [
            'deactivated_by' => auth()->id(),
            'deactivated_at' => now()->toDateTimeString(),
        ]);
    }

    public function logs()
    {
        return $this->morphMany(Log::class, 'model');
    }
} 