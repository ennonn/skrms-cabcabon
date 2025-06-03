import { PageProps } from '@inertiajs/core';
import { Head } from '@inertiajs/react';

interface ValidationErrorPageProps extends PageProps {
    status: number;
    message: string;
    errors: Record<string, string[]>;
}

export default function ValidationError({ status, message, errors }: ValidationErrorPageProps) {
    return (
        <>
            <Head title={`Error ${status}`} />
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white dark:bg-gray-900">
                <div className="max-w-xl px-5 text-center">
                    <h2 className="mb-2 text-[42px] font-bold text-zinc-800 dark:text-zinc-200">
                        {status}
                    </h2>
                    <p className="mb-8 text-lg text-zinc-500 dark:text-zinc-400">
                        {message}
                    </p>
                    {errors && Object.keys(errors).length > 0 && (
                        <div className="mt-4 text-left">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                                Please correct the following errors:
                            </h3>
                            <ul className="list-disc list-inside space-y-1">
                                {Object.entries(errors).map(([field, messages]) => (
                                    messages.map((message, index) => (
                                        <li key={`${field}-${index}`} className="text-sm text-red-600 dark:text-red-400">
                                            {message}
                                        </li>
                                    ))
                                ))}
                            </ul>
                        </div>
                    )}
                    <button
                        onClick={() => window.history.back()}
                        className="mt-8 inline-block rounded-lg bg-zinc-600 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </>
    );
} 