<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $apiUrl;
    protected $apiToken;

    public function __construct()
    {
        $this->apiUrl = 'https://sms.iprogtech.com/api/v1/sms_messages';
        $this->apiToken = env('IPROG_SMS_API_TOKEN');
    }

    /**
     * Send an SMS message
     *
     * @param string $phoneNumber The recipient's phone number
     * @param string $message The message content
     * @param int $provider The SMS provider (0 or 1)
     * @return array The API response
     */
    public function send($phoneNumber, $message, $provider = 0)
    {
        try {
            // Format phone number to ensure it starts with 63
            $phoneNumber = $this->formatPhoneNumber($phoneNumber);

            $data = [
                'api_token' => $this->apiToken,
                'message' => $message,
                'phone_number' => $phoneNumber,
                'sms_provider' => $provider
            ];

            $ch = curl_init($this->apiUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/x-www-form-urlencoded'
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            // Log the response
            Log::info('SMS API Response', [
                'phone_number' => $phoneNumber,
                'response' => $response,
                'http_code' => $httpCode
            ]);

            return json_decode($response, true);
        } catch (\Exception $e) {
            Log::error('SMS sending failed', [
                'error' => $e->getMessage(),
                'phone_number' => $phoneNumber
            ]);

            return [
                'status' => 500,
                'message' => 'Failed to send SMS: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Format phone number to ensure it starts with 63
     *
     * @param string $phoneNumber
     * @return string
     */
    protected function formatPhoneNumber($phoneNumber)
    {
        // Remove any non-numeric characters
        $phoneNumber = preg_replace('/[^0-9]/', '', $phoneNumber);

        // If number starts with 0, replace with 63
        if (substr($phoneNumber, 0, 1) === '0') {
            $phoneNumber = '63' . substr($phoneNumber, 1);
        }
        // If number doesn't start with 63, add it
        elseif (substr($phoneNumber, 0, 2) !== '63') {
            $phoneNumber = '63' . $phoneNumber;
        }

        return $phoneNumber;
    }
} 