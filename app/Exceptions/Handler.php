<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Http\Exceptions\HttpException;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Inertia\Inertia;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        $this->renderable(function (Throwable $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage() ?: 'Server Error',
                    'status' => 500
                ], 500);
            }

            if ($request->header('X-Inertia')) {
                return $this->prepareInertiaResponse($e, $request);
            }

            $status = 500;
            
            if ($e instanceof HttpException) {
                $status = $e->getStatusCode();
            }

            if ($e instanceof ValidationException) {
                return back()->withErrors($e->errors());
            }

            if ($e instanceof AuthenticationException) {
                return Inertia::render('auth/login', [
                    'error' => 'Please login to continue.',
                    'status' => 401
                ])->toResponse($request)->setStatusCode(401);
            }

            if ($e instanceof \Illuminate\Auth\Access\AuthorizationException) {
                return Inertia::render('errors/forbidden', [
                    'status' => 403,
                    'message' => 'You do not have permission to perform this action.'
                ])->toResponse($request)->setStatusCode(403);
            }

            return Inertia::render('errors/error', [
                'status' => $status,
                'message' => $e->getMessage() ?: 'Server Error'
            ])->toResponse($request)->setStatusCode($status);
        });
    }

    /**
     * Prepare an Inertia response for the exception.
     */
    protected function prepareInertiaResponse(Throwable $e, $request)
    {
        $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
        
        // Use 500 for server errors or default to the exception status code
        if ($status >= 500 || !in_array($status, [401, 403, 404, 422])) {
            $status = 500;
        }
        
        $message = $e->getMessage();
        if (empty($message) || $status === 500) {
            $message = $status === 404 ? 'The page could not be found.' : 'An unexpected error occurred.';
        }

        // Log detailed information about the error
        if ($status === 500) {
            \Log::error('Inertia-captured exception', [
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        return Inertia::render('errors/error', [
            'status' => $status,
            'message' => $message,
            'exception' => get_class($e),
            'detail' => config('app.debug') ? $e->getMessage() : null,
        ])->toResponse($request)->setStatusCode($status);
    }
} 