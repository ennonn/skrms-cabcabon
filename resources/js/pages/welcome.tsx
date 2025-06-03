import { Link } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';

interface User {
    role: string;
}

interface Props extends PageProps {
    auth: {
        user: User | null;
    };
}

export default function Welcome() {
    const { auth } = usePage<Props>().props;

    const getDashboardRoute = () => {
        if (auth.user?.role === 'admin' || auth.user?.role === 'superadmin') {
            return 'admin.dashboard';
        }
        return 'dashboard';
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen">
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end">
                        {auth.user ? (
                                <Link
                                    href={route(getDashboardRoute())}
                            className="font-semibold text-gray-600 hover:text-gray-900 focus:outline focus:outline-2 focus:rounded-sm focus:outline-green-500"
                                >
                                    Dashboard
                                </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900 focus:outline focus:outline-2 focus:rounded-sm focus:outline-green-500"
                                >
                                    Log in
                                </Link>

                                <Link
                                    href={route('register')}
                                className="ms-4 font-semibold text-gray-600 hover:text-gray-900 focus:outline focus:outline-2 focus:rounded-sm focus:outline-green-500"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                </div>

                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    <div className="flex flex-col items-center">
                        <img src="/images/logo.svg" alt="SK Cabcabon Logo" className="w-64 h-64 mb-8" />
                        
                        <h1 className="text-4xl font-bold text-gray-900 text-center">
                            Sangguniang Kabataan Cabcabon
                        </h1>
                        <h2 className="mt-4 text-2xl text-gray-700 text-center">
                            Integrated Record Management System
                        </h2>
                        <p className="mt-4 text-x text-gray-600 text-center max-w-2xl">
                            Empowering the youth of Cabcabon through leadership, service, and community engagement.
                        </p>
                        </div>
                </div>
            </div>
        </div>
    );
}
