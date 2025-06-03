import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import { Pagination } from '@/components/pagination';import { Search } from 'lucide-react';

interface RejectedProfile {
    id: number;
    status: string;
    user_id: number;
    approver_id: number | null;
    approval_notes: string | null;
    full_name: string;
    address: string;
    gender: string;
    birthdate: string;
    age: number;
    email: string | null;
    phone: string | null;
    civil_status: string;
    youth_age_group: string;
    personal_monthly_income: number | null;
    interests_hobbies: string | null;
    suggested_programs: string | null;
    mother_name: string | null;
    father_name: string | null;
    parents_monthly_income: number | null;
    education_level: string;
    youth_classification: string;
    work_status: string;
    is_sk_voter: boolean;
    assembly_attendance: number | null;
    user: {
        id: number;
        name: string;
    };
    approver: {
        id: number;
        name: string;
    } | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    profiles: {
        data: RejectedProfile[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

const breadcrumbs = [
    {
        title: 'Rejected Profiles',
        href: route('youth-profiles.rejected.index'),
    },
];

export default function RejectedYouthProfiles({ profiles }: Props) {
    const { user } = useAuth();
    const [selectedProfile, setSelectedProfile] = useState<RejectedProfile | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('youth-profiles.rejected.index'), {
            search: value
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('youth-profiles.rejected.index'), {
            page
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const calculateAge = (birthdate: string | undefined) => {
        if (!birthdate) return 'N/A';
        
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    return (
        <AppLayout 
            breadcrumbs={breadcrumbs}
            user={user}
        >
            <Head title="Rejected Youth Profiles" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <Input
                                        type="search"
                                        placeholder="Search rejected profiles..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Education</TableHead>
                                        <TableHead>Employment</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(!profiles.data || profiles.data.length === 0) ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-muted-foreground">
                                                No rejected profiles found.
                                            </TableCell>
                                        </TableRow>
                                    ) :
                                        profiles.data.map((profile) => (
                                            <TableRow key={profile.id}>
                                                <TableCell>{profile.full_name}</TableCell>
                                                <TableCell>
                                                    {calculateAge(profile.birthdate)}
                                                </TableCell>
                                                <TableCell>{profile.education_level}</TableCell>
                                                <TableCell>{profile.work_status}</TableCell>
                                                <TableCell>{profile.phone || 'N/A'}</TableCell>
                                                <TableCell>{profile.email || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Link href={route('youth-profiles.rejected.show', profile.id)}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('youth-profiles.rejected.edit', profile.id)}>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                            >
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {profiles.last_page > 1 && (
                                <Pagination
                                    currentPage={profiles.current_page}
                                    lastPage={profiles.last_page}
                                    total={profiles.total}
                                    perPage={profiles.per_page}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}