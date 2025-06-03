import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    status: number;
    message: string;
    exception?: string;
    detail?: string;
}

export default function ErrorPage({ status, message, exception, detail }: Props) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <Head title={`Error ${status}`} />
            
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Error {status}</h1>
                <p className="text-gray-700 mb-6">{message}</p>
                
                {detail && (
                    <div className="bg-gray-100 p-4 rounded mb-6 text-left">
                        <p className="text-sm text-gray-600 mb-2">Error details:</p>
                        <p className="text-xs text-gray-800 font-mono overflow-auto">{detail}</p>
                    </div>
                )}
                
                {exception && (
                    <p className="text-xs text-gray-500 mb-6">{exception}</p>
                )}
                
                <div className="flex flex-col gap-2">
                    <Button 
                        onClick={() => window.location.href = '/youth-profiles/manage'}
                        className="w-full"
                    >
                        Return to Profiles
                    </Button>
                    
                    <Button 
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="w-full"
                    >
                        Refresh Page
                    </Button>
                </div>
            </div>
        </div>
    );
} 