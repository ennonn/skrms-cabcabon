<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class SystemSettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/settings/index', [
            'settings' => [
                'maintenance_mode' => app()->isDownForMaintenance(),
                'app_name' => config('app.name'),
                'app_environment' => config('app.env'),
                'app_debug' => config('app.debug'),
                'app_url' => config('app.url'),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'app_url' => 'required|url',
        ]);

        // Update .env file
        $this->updateEnvironmentFile([
            'APP_NAME' => $validated['app_name'],
            'APP_URL' => $validated['app_url'],
        ]);

        return back()->with('success', 'System settings updated successfully.');
    }

    public function toggleMaintenanceMode(Request $request)
    {
        if (app()->isDownForMaintenance()) {
            Artisan::call('up');
            $message = 'Application is now live.';
        } else {
            Artisan::call('down', [
                '--secret' => 'your-secret-token',
                '--render' => 'maintenance',
            ]);
            $message = 'Application is now in maintenance mode.';
        }

        return back()->with('success', $message);
    }

    public function clearCache()
    {
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');

        return back()->with('success', 'System cache cleared successfully.');
    }

    private function updateEnvironmentFile(array $data)
    {
        $path = base_path('.env');
        $content = file_get_contents($path);

        foreach ($data as $key => $value) {
            $content = preg_replace(
                "/^{$key}=.*/m",
                "{$key}=" . (str_contains($value, ' ') ? "\"$value\"" : $value),
                $content
            );
        }

        file_put_contents($path, $content);
    }
} 