<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Session Expired</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-white dark:bg-gray-900">
    <div class="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div class="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
            <svg class="h-8 w-8 text-orange-600 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        
        <div class="mt-6 space-y-3">
            <h1 class="text-4xl font-bold tracking-tighter text-gray-900 dark:text-gray-100 sm:text-5xl">
                Session Expired
            </h1>
            <p class="text-gray-600 dark:text-gray-400 max-w-[42rem] leading-normal sm:text-lg sm:leading-8">
                {{ $message ?? 'You have been inactive for a long period of time. Please log in again to continue.' }}
            </p>
        </div>

        <div class="mt-8 flex gap-4">
            <a href="{{ route('login') }}" 
               class="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                Log in again
            </a>
        </div>

        <div class="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Redirecting to login in <span id="countdown">5</span> seconds...
        </div>
    </div>

    <script>
        let countdown = 5;
        const countdownElement = document.getElementById('countdown');
        
        const timer = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(timer);
                window.location.href = '{{ route('login') }}';
            }
        }, 1000);
    </script>
</body>
</html> 