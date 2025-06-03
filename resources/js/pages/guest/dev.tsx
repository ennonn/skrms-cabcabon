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

export default function Dev() {
    const { auth } = usePage<Props>().props;

    return (
        <div className="min-h-screen bg-white">
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen">
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
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
                        <img src="/images/logo.svg" alt="SK Cabcabon Logo" className="w-32 h-32 mb-8" />
                        
                        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
                            Development Team
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl">
                            {/* Lead Developer */}
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <span className="text-4xl">👨‍💻</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Aljon Fernano</h3>
                                <p className="text-gray-600">Lead Developer</p>
                                <p className="text-sm text-gray-500 mt-2 text-center">Full-stack Development</p>
                            </div>

                            {/* Thesis Adviser */}
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <span className="text-4xl">👨‍🎓</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Joko Saco</h3>
                                <p className="text-gray-600">Project Manager</p>
                                <p className="text-sm text-gray-500 mt-2 text-center">Project Supervision</p>
                            </div>

                            {/* Stakeholder */}
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <span className="text-4xl">👨‍⚖️</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Kent Lawrence Almar Samson</h3>
                                <p className="text-gray-600">Layout Artist</p>
                                <p className="text-sm text-gray-500 mt-2 text-center">Visual Design</p>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="mt-16 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                            <p className="text-gray-600 mb-6">Have questions or suggestions? We'd love to hear from you.</p>
                            <div className="flex justify-center space-x-6">
                                <a 
                                    href="mailto:contact@example.com" 
                                    className="text-green-600 hover:text-green-800 transition-colors"
                                >
                                    Email Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 