<?php

namespace App\Mail;

use App\Models\Proposal;
use App\Services\SmsService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProposalApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $proposal;
    public $youth;
    protected $smsService;

    public function __construct(Proposal $proposal, $youth)
    {
        $this->proposal = $proposal;
        $this->youth = $youth;
        $this->smsService = app(SmsService::class);
    }

    public function build()
    {
        // Send SMS notification
        try {
            $message = "Hello {$this->youth->personalInformation->full_name}!\n\n" .
                "A new program has been approved that matches your interests:\n\n" .
                "Title: {$this->proposal->title}\n" .
                "Category: {$this->proposal->category->name}\n" .
                "Description: {$this->proposal->description}\n" .
                "Location: {$this->proposal->location}\n" .
                "Period: {$this->proposal->implementation_start_date} to {$this->proposal->implementation_end_date}\n\n" .
                "This program aligns with your interests. We encourage you to get involved!\n\n" .
                "Thank you for your continued engagement with our youth programs!";

            $phone = $this->youth->personalInformation->phone;
            if ($phone) {
                $this->smsService->send($phone, $message);
                \Log::info('Proposal approval SMS sent successfully to youth', [
                    'phone' => $phone,
                    'proposal_id' => $this->proposal->id,
                    'youth_id' => $this->youth->id
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to send proposal approval SMS to youth: ' . $e->getMessage(), [
                'phone' => $phone ?? null,
                'proposal_id' => $this->proposal->id,
                'youth_id' => $this->youth->id,
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
        }

        return $this->subject('New Program Matches Your Interests!')
            ->view('emails.proposal-approved');
    }
} 