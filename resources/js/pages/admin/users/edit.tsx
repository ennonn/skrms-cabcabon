import { Head, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    birthdate: string;
    phone_number: string;
};

type Props = {
    user: User;
    auth: {
        user: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
        };
    };
    flash?: {
        success?: string | null;
        error?: string | null;
    };
};

export default function EditUser({ user, auth, flash = { success: null, error: null } }: Props) {
    // Format the birthdate to ensure it's in YYYY-MM-DD format
    const formattedBirthdate = user.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : '';

    const [formData, setFormData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        birthdate: formattedBirthdate,
        phone_number: user.phone_number,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        console.log('Submitting form data:', formData);
        
        router.put(route('admin.users.update', { user: user.id }), formData, {
            onSuccess: () => {
                console.log('Form submitted successfully');
                setIsSubmitting(false);
                toast.success('User updated successfully');
                router.visit(route('admin.users.index'), {
                    preserveScroll: true
                });
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                setError(Object.values(errors)[0] as string);
                setIsSubmitting(false);
            },
            onFinish: () => {
                console.log('Form submission finished');
                setIsSubmitting(false);
            }
        });
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={`Edit User - ${user.first_name} ${user.last_name}`} />

            <div className="container py-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-semibold">Edit User</h1>
                        <Button variant="outline" onClick={() => router.get(route('admin.users.index'))}>
                            Back to Users
                        </Button>
                    </div>

                    {(flash.error || error) && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{flash.error || error}</AlertDescription>
                        </Alert>
                    )}

                    {flash.success && (
                        <Alert className="mb-6">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    )}

                    <div className="bg-card rounded-lg shadow p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email (cannot be changed)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    disabled
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="birthdate">Birthdate</Label>
                                    <Input
                                        id="birthdate"
                                        name="birthdate"
                                        type="date"
                                        value={formData.birthdate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone_number">Phone Number</Label>
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        required
                                        placeholder="09123456789"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 