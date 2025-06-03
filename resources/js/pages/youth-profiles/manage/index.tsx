import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
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
import { Pagination } from '@/components/pagination';
import { Phone, Mail } from 'lucide-react';

interface YouthProfile {
    id: number;
    full_name: string;
    birthdate: string;
    gender: string;
    email: string | null;
    phone: string | null;
    address: string;
    education_level: string;
    work_status: string;
    is_sk_voter: boolean;
    assembly_attendance: number | null;
    created_at: string;
    updated_at: string;
    from_google_form?: boolean;
}

interface Props {
    profiles: {
        data: YouthProfile[];
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
    sort?: 'name' | 'education';
    order?: 'asc' | 'desc';
    educationFilter?: string;
    ageFilter?: string;
    search?: string;
}

const breadcrumbs = [
    {
        title: 'Manage Profiles',
        href: route('youth-profiles.manage'),
    },
];

export default function ManageYouthProfiles({ 
    profiles,
    sort = 'name',
    order = 'asc',
    educationFilter = 'all',
    ageFilter = 'all',
    search = ''
}: Props) {
    const { user } = useAuth();
    const { auth } = usePage().props as any;
    const [selectedProfile, setSelectedProfile] = useState<YouthProfile | null>(null);
    const [searchQuery, setSearchQuery] = useState(search);
    const [selectedAgeFilter, setSelectedAgeFilter] = useState(ageFilter);
    const [selectedEducationFilter, setSelectedEducationFilter] = useState(educationFilter);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('youth-profiles.manage'), {
            sort,
            order,
            education: selectedEducationFilter,
            age: selectedAgeFilter,
            search: value
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('youth-profiles.manage'), {
            sort,
            order,
            education: selectedEducationFilter,
            age: selectedAgeFilter,
            search: searchQuery,
            page
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleAgeFilter = (value: string) => {
        setSelectedAgeFilter(value);
        router.get(route('youth-profiles.manage'), {
            sort,
            order,
            education: selectedEducationFilter,
            age: value,
            search: searchQuery
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleEducationFilter = (value: string) => {
        setSelectedEducationFilter(value);
        router.get(route('youth-profiles.manage'), {
            sort,
            order,
            education: value,
            age: selectedAgeFilter,
            search: searchQuery
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

    const handleDelete = (id: number) => {
        setIsDeleting(true);
        
        console.log('Starting delete request for profile ID:', id);
        
        // Use simpler POST request to the new admin-delete endpoint
        fetch(route('youth-profiles.manage.admin-delete', id), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin'
        })
        .then(response => {
            console.log('Delete response status:', response.status);
            
            if (response.ok) {
                toast.success('Profile deleted successfully');
                window.location.href = route('youth-profiles.manage');
            } else {
                return response.json().then(data => {
                    console.error('Error response data:', data);
                    throw new Error(data.message || 'An error occurred while deleting the profile');
                });
            }
        })
        .catch(error => {
            console.error('Delete error:', error);
            toast.error(error.message || 'Failed to delete profile');
        })
        .finally(() => {
            setShowDeleteDialog(false);
            setSelectedProfileId(null);
            setIsDeleting(false);
        });
    };

    return (
        <AppLayout
            user={auth.user}
            auth={auth}
            breadcrumbs={[
                { title: 'Youth Profiles', href: route('youth-profiles.manage') },
                { title: 'Manage', href: route('youth-profiles.manage') },
            ]}
        >
            <Head title="Manage Youth Profiles" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <Input
                                        type="search"
                                        placeholder="Search youth profiles..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Select value={selectedAgeFilter} onValueChange={handleAgeFilter}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Age Group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Age Groups</SelectItem>
                                            <SelectItem value="15-20">15-20 years</SelectItem>
                                            <SelectItem value="21-25">21-25 years</SelectItem>
                                            <SelectItem value="26-30">26-30 years</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={selectedEducationFilter} onValueChange={handleEducationFilter}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Education Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Education Levels</SelectItem>
                                            <SelectItem value="elementary_level">Elementary Level</SelectItem>
                                            <SelectItem value="elementary_graduate">Elementary Graduate</SelectItem>
                                            <SelectItem value="high_school_level">High School Level</SelectItem>
                                            <SelectItem value="high_school_graduate">High School Graduate</SelectItem>
                                            <SelectItem value="college_level">College Level</SelectItem>
                                            <SelectItem value="college_graduate">College Graduate</SelectItem>
                                            <SelectItem value="vocational">Vocational</SelectItem>
                                            <SelectItem value="post_graduate">Post Graduate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Education</TableHead>
                                        <TableHead>Contact Information</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(!profiles.data || profiles.data.length === 0) ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                No profiles found.
                                            </TableCell>
                                        </TableRow>
                                    ) :
                                        profiles.data.map((profile) => (
                                            <TableRow key={profile.id}>
                                                <TableCell>{profile.full_name}</TableCell>
                                                <TableCell>{calculateAge(profile.birthdate)}</TableCell>
                                                <TableCell>{profile.education_level}</TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {profile.phone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="h-4 w-4" />
                                                                {profile.phone}
                                                            </div>
                                                        )}
                                                        {profile.email && (
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="h-4 w-4" />
                                                                {profile.email}
                                                            </div>
                                                        )}
                                                        {!profile.phone && !profile.email && 'N/A'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Link href={route('youth-profiles.manage.show', profile.id)}>
                                                            <Button variant="outline" size="sm">
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('youth-profiles.manage.edit', profile.id)}>
                                                            <Button variant="default" size="sm">
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedProfileId(profile.id);
                                                                setShowDeleteDialog(true);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={(open) => {
                if (!isDeleting) {
                    setShowDeleteDialog(open);
                    if (!open) setSelectedProfileId(null);
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Profile</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this profile? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (!isDeleting) {
                                    setShowDeleteDialog(false);
                                    setSelectedProfileId(null);
                                }
                            }}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedProfileId && handleDelete(selectedProfileId)}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Profile'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}