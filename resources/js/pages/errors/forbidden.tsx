import { Head } from '@inertiajs/react';
import { ShieldX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    status?: number;
    message?: string;
}

export default function Forbidden({ 
    status = 403, 
    message = "You don't have permission to access this page." 
}: Props) {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (countdown > 0) {
                setCountdown(countdown - 1);
            } else {
                // Use window.location for a hard redirect to ensure clean state
                window.location.href = '/';
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Head title={`Error ${status}`} />
            
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
                    <ShieldX className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                
                <div className="mt-6 space-y-3">
                    <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-gray-100 sm:text-5xl">
                        {status}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-[42rem] leading-normal sm:text-lg sm:leading-8">
                        {message}
                    </p>
                </div>

                <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                    Redirecting to home in {countdown} seconds...
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="inline-flex h-10 items-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    >
                        Go home
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex h-10 items-center rounded-md border border-gray-200 px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    >
                        Go back
                    </button>
                </div>
            </div>
        </div>
    );
} 