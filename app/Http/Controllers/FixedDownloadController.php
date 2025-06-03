<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProposalAttachment;
use Illuminate\Support\Facades\Storage;

class FixedDownloadController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function download(ProposalAttachment $attachment)
    {
        try {
            // Check if user is authorized to download the attachment
            if (!auth()->user()->can('download', $attachment->proposal)) {
                abort(403, 'You are not authorized to download this file.');
            }
            
            // Check if file exists
            $filePath = storage_path('app/public/' . $attachment->path);
            
            if (!file_exists($filePath)) {
                return back()->with('error', 'File not found.');
            }
            
            // Set the filename for download
            $filename = $attachment->original_filename ?: $attachment->filename;
            
            // Use headers for inline view (PDF) or download based on mime type
            $headers = [
                'Content-Type' => $attachment->mime_type,
            ];
            
            return response()->file($filePath, $headers);
        } catch (\Exception $e) {
            return back()->with('error', 'An error occurred while downloading the file.');
        }
    }
}
