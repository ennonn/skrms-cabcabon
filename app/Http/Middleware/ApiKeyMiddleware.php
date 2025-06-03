<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiKeyMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $apiKey = $request->header('X-API-Key');
        $validApiKey = config('services.zapier.api_key');

        if (!$apiKey || $apiKey !== $validApiKey) {
            return response()->json([
                'error' => 'Invalid API key'
            ], 401);
        }

        return $next($request);
    }
} 