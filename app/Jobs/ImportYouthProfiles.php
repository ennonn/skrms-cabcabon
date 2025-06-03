<?php

namespace App\Jobs;

use App\Models\Records\PendingYouthProfile;
use App\Notifications\ImportCompleted;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class ImportYouthProfiles implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data;
    protected $userId;

    public function __construct(array $data, int $userId)
    {
        $this->data = $data;
        $this->userId = $userId;
    }

    public function handle()
    {
        $status = Cache::get('zapier_import_status_' . $this->userId, [
            'total' => count($this->data),
            'processed' => 0,
            'duplicates' => 0,
            'errors' => 0,
        ]);

        foreach ($this->data as $record) {
            try {
                // Check for duplicates
                if ($this->isDuplicate($record)) {
                    $status['duplicates']++;
                    $status['processed']++;
                    Cache::put('zapier_import_status_' . $this->userId, $status, now()->addHour());
                    continue;
                }

                // Create pending profile
                PendingYouthProfile::create([
                    'user_id' => $this->userId,
                    'status' => 'pending',
                    'form_submitted_at' => now(),
                    'data_collection_agreement' => true,
                    'full_name' => $record['full_name'],
                    'address' => $record['address'],
                    'gender' => $record['gender'],
                    'birthdate' => $record['birthdate'],
                    'email' => $record['email'] ?? null,
                    'phone' => $record['phone'] ?? null,
                    'civil_status' => $record['civil_status'] === 'Unkown' ? 'Unknown' : $record['civil_status'],
                    'youth_age_group' => $record['youth_age_group'] ?? null,
                    'education_level' => $record['education_level'] ?? null,
                    'youth_classification' => $record['youth_classification'] ?? null,
                    'work_status' => $record['work_status'] ?? null,
                    'is_sk_voter' => $record['is_sk_voter'] ?? false,
                    'is_registered_national_voter' => $record['is_registered_national_voter'] ?? false,
                    'voted_last_election' => $record['voted_last_election'] ?? false,
                    'mother_name' => $record['mother_name'] ?? null,
                    'father_name' => $record['father_name'] ?? null,
                    'parents_monthly_income' => $record['parents_monthly_income'] ?? null,
                    'personal_monthly_income' => $record['personal_monthly_income'] ?? null,
                    'interests_hobbies' => $record['interests_hobbies'] ?? null,
                    'suggested_programs' => $record['suggested_programs'] ?? null,
                ]);

                $status['processed']++;
            } catch (\Exception $e) {
                Log::error('Import error: ' . $e->getMessage(), [
                    'record' => $record,
                    'user_id' => $this->userId,
                ]);
                $status['errors']++;
                $status['processed']++;
            }

            Cache::put('zapier_import_status_' . $this->userId, $status, now()->addHour());
        }

        // Send completion notification
        $user = \App\Models\User::find($this->userId);
        Notification::send($user, new ImportCompleted($status));
    }

    protected function isDuplicate($record)
    {
        return PendingYouthProfile::where(function ($query) use ($record) {
            $query->where('full_name', $record['full_name'])
                ->where('birthdate', $record['birthdate']);
        })->exists();
    }
} 