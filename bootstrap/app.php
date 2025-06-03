<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\CheckRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Auth\Middleware\Authenticate;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Global middleware
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // Web middleware group
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\CheckMaintenanceMode::class,
        ]);

        // API middleware group
        $middleware->api(append: [
            // Add any API specific middleware here
        ]);

        // Named middleware
        $middleware->alias([
            'auth' => Authenticate::class,
            'verified' => EnsureEmailIsVerified::class,
            'role' => CheckRole::class,
            'maintenance' => \App\Http\Middleware\CheckMaintenanceMode::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            // Handle API requests
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'status' => $e instanceof NotFoundHttpException ? 404 : ($e->getCode() ?: 500)
                ], $e instanceof NotFoundHttpException ? 404 : ($e->getCode() ?: 500));
            }

            // In local environment, show detailed errors
            if (app()->environment('local') && !$e instanceof NotFoundHttpException) {
                throw $e;
            }

            // Determine the error type
            $status = match (true) {
                $e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException => 404,
                $e instanceof \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException => 403,
                default => 500
            };

            // Get the appropriate error page and message
            $page = match ($status) {
                404 => 'errors/not-found',
                403 => 'errors/forbidden',
                default => 'errors/error'
            };

            $message = match ($status) {
                404 => "Looks like you've ventured into the unknown digital realm.",
                403 => "You don't have permission to access this page.",
                default => "Something went wrong on our end."
            };

            // Render the error page
            return Inertia::render($page, [
                'status' => $status,
                'message' => $message
            ]);
        });

        // Register a fallback 404 handler for any unhandled routes
        $exceptions->renderable(function (NotFoundHttpException $e) {
            return Inertia::render('errors/not-found', [
                'status' => 404,
                'message' => "Looks like you've ventured into the unknown digital realm."
            ]);
        });
    })->create();
