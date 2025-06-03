<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\YouthProfile;
use App\Models\ActivityPlan;
use App\Models\BudgetPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use League\Csv\Writer;
use SplTempFileObject;

class DataExportController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/DataExport');
    }

    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required|in:users,youth_profiles,activity_plans,budget_plans',
            'format' => 'required|in:csv,json',
        ]);

        $data = match ($request->type) {
            'users' => User::all(),
            'youth_profiles' => YouthProfile::all(),
            'activity_plans' => ActivityPlan::all(),
            'budget_plans' => BudgetPlan::all(),
        };

        if ($request->format === 'csv') {
            return $this->exportToCsv($data, $request->type);
        }

        return response()->json($data);
    }

    private function exportToCsv($data, $type)
    {
        $csv = Writer::createFromFileObject(new SplTempFileObject());
        
        // Add headers
        $headers = array_keys($data->first()->toArray());
        $csv->insertOne($headers);

        // Add data
        foreach ($data as $row) {
            $csv->insertOne($row->toArray());
        }

        $filename = "{$type}_export_" . now()->format('Y-m-d_H-i-s') . '.csv';
        
        return response($csv->toString(), 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
} 