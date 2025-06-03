import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [
    {
        title: 'About',
        href: route('about.index'),
    },
];

export default function About() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="About" />
            
            <div className="min-h-screen py-8 relative">
                {/* Background Logo */}
                <div 
                    className="absolute inset-0 opacity-20 bg-contain bg-center bg-no-repeat pointer-events-none mt-5 bg-[length:20%]"
                    style={{ 
                        backgroundImage: 'url(/images/logo.svg)',
                    }}
                />
                
                {/* Content */}
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
                            About Us
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                            The <span className="font-bold">Barangay Cabcabon SK Record Management System</span> is a digital platform 
                            designed to streamline youth-related records, projects, and membership data. It 
                            replaces manual processes with a secure, centralized database, improving efficiency, 
                            transparency, and reporting for the Sangguniang Kabataan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
                            <p className="text-gray-600">
                                To provide an efficient and transparent system for managing youth profiles and activities 
                                in Barangay Cabcabon, ensuring accurate record-keeping and streamlined processes for the 
                                benefit of our youth and community leaders.
                            </p>
                        </div>

                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h2>
                            <p className="text-gray-600">
                                To be the standard for youth engagement and record management systems, fostering increased 
                                participation and better decision-making in youth development programs through data-driven insights.
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Core Values</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="text-center p-3">
                                <h3 className="font-semibold text-base text-gray-900 mb-1">Transparency</h3>
                                <p className="text-sm text-gray-600">in all operations</p>
                            </div>
                            <div className="text-center p-3">
                                <h3 className="font-semibold text-base text-gray-900 mb-1">Efficiency</h3>
                                <p className="text-sm text-gray-600">in record management</p>
                            </div>
                            <div className="text-center p-3">
                                <h3 className="font-semibold text-base text-gray-900 mb-1">Security</h3>
                                <p className="text-sm text-gray-600">of youth information</p>
                            </div>
                            <div className="text-center p-3 sm:col-span-2 md:col-span-1">
                                <h3 className="font-semibold text-base text-gray-900 mb-1">Accessibility</h3>
                                <p className="text-sm text-gray-600">for stakeholders</p>
                            </div>
                            <div className="text-center p-3 sm:col-span-2 md:col-span-1">
                                <h3 className="font-semibold text-base text-gray-900 mb-1">Innovation</h3>
                                <p className="text-sm text-gray-600">in service delivery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 