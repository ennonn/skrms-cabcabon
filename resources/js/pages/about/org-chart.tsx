import { Head } from '@inertiajs/react';

export default function OrgChart() {
    return (
        <>
            <Head title="Organization Chart" />
            <div className="min-h-screen w-full flex items-center justify-center bg-white">
                <img 
                    src="/images/sk-org-chart.svg" 
                    alt="Organization Chart"
                    className="w-full h-screen object-contain"
                />
            </div>
        </>
    );
} 