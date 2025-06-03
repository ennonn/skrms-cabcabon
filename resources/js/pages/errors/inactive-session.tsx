import { Head } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    status?: number;
    message?: string;
}

export default function InactiveSession({ 
    status = 440, 
    message = "You have been inactive for a long period of time. Please log in again to continue."
}: Props) {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (countdown > 0) {
                setCountdown(countdown - 1);
            } else {
                router.visit(route('login'));
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Head title={`Session Expired`} />
            
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
                    <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                
                <div className="mt-6 space-y-3">
                    <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-gray-100 sm:text-5xl">
                        Session Expired
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-[42rem] leading-normal sm:text-lg sm:leading-8">
                        {message}
                    </p>
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        onClick={() => router.visit(route('login'))}
                        className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        Log in again
                    </button>
                </div>

                <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                    Redirecting to login in {countdown} seconds...
                </div>
            </div>
        </div>
    );
} 