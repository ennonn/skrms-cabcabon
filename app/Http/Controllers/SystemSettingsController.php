<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class SystemSettingsController extends Controller
{
    public function toggleMaintenanceMode(Request $request)
    {
        if (app()->isDownForMaintenance()) {
            Artisan::call('up');
            $message = 'Maintenance mode disabled';
        } else {
            Artisan::call('down');
            $message = 'Maintenance mode enabled';
        }

        return back()->with('success', $message);
    }
} 