import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type ProposalCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface Auth {
    user: {
        id: number;
        title: string;
        email: string;
        role: string;
    };
}

interface Proposal {
    id: number;
    title: string;
    description: string;
    status: string;
    proposal_category_id: number;
    implementation_start_date: string;
    implementation_end_date: string;
    location: string;
    people_involved: string;
    target_participants: number;
    estimated_cost: number;
    frequency: string;
    funding_source: string;
    objectives: string | string[];
    expected_outcomes: string | string[];
    category?: {
        id: number;
        title: string;
    };
    submitter?: any;
    approver?: any;
}

interface Props {
    auth: Auth;
    proposal: Proposal;
    categories: ProposalCategory[];
}

export default function EditProposal({ auth, proposal, categories }: Props) {
    const breadcrumbs = [
        { 
            title: 'Dashboard', 
            href: route('dashboard') 
        },
        { 
            title: 'My Proposals', 
            href: route('proposals.my.index') 
        },
        { 
            title: 'Edit Proposal', 
            href: route('proposals.my.edit', proposal.id) 
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Edit Proposal" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold mb-6">Edit Proposal</h1>
                    <EditProposalForm proposal={proposal} categories={categories} />
                </div>
            </div>
        </AppLayout>
    );
}

function EditProposalForm({ proposal, categories }: { proposal: Proposal; categories: ProposalCategory[] }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReturningToDraft, setIsReturningToDraft] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState({
        category_id: proposal.proposal_category_id.toString(),
        title: proposal.title,
        description: proposal.description,
        implementation_start_date: proposal.implementation_start_date,
        implementation_end_date: proposal.implementation_end_date,
        location: proposal.location,
        people_involved: proposal.people_involved,
        target_participants: proposal.target_participants.toString(),
        estimated_cost: proposal.estimated_cost.toString(),
        frequency: proposal.frequency,
        funding_source: proposal.funding_source,
        objectives: Array.isArray(proposal.objectives) 
            ? proposal.objectives.join('\n') 
            : proposal.objectives || '',
        expected_outcomes: Array.isArray(proposal.expected_outcomes) 
            ? proposal.expected_outcomes.join('\n') 
            : proposal.expected_outcomes || '',
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Define the required form fields with consistent naming
        const requiredFields = [
            'category_id',
            'title',
            'description',
            'implementation_start_date',
            'implementation_end_date',
            'location',
            'people_involved',
            'target_participants',
            'estimated_cost',
            'frequency',
            'funding_source',
            'objectives',
            'expected_outcomes'
        ];

        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields`);
            setIsSubmitting(false);
            return;
        }

        // Show toast before submission for immediate feedback
        toast.success('Updating your proposal...');

        // Prepare form data
        const formPayload = new FormData();
        
        // Add text fields
        Object.entries(formData).forEach(([key, value]) => {
            formPayload.append(key, value);
        });

        // Add files
        files.forEach(file => {
            formPayload.append('attachments[]', file);
        });

        // Use PUT method for update
        formPayload.append('_method', 'PUT');

        // Submit form
        console.log('Submitting form data:', Object.fromEntries(formPayload.entries()));
        
        router.post(route('proposals.my.update', proposal.id), formPayload, {
            forceFormData: true,
            onSuccess: (page) => {
                console.log('Proposal update successful');
                toast.success('Proposal updated successfully');
                
                // Redirect to the show page with the updated proposal
                if (page.url) {
                    router.visit(page.url);
                } else {
                    router.visit(route('proposals.my.show', proposal.id));
                }
            },
            onError: (errors) => {
                console.error('Update errors:', errors);
                
                if (Object.keys(errors).length > 0) {
                    // Show all error messages
                    Object.entries(errors).forEach(([field, message]) => {
                        console.error(`Field ${field} error:`, message);
                    });
                    
                    // Show the first error message
                    const firstError = Object.values(errors)[0];
                    toast.error(`Failed to update proposal: ${firstError}`);
                } else {
                    toast.error('Failed to update proposal. Please check the form and try again.');
                }
                
                setIsSubmitting(false);
            }
        });
    };

    const handleReturnToDraft = () => {
        setIsReturningToDraft(true);
        
        router.post(route('proposals.my.withdraw', proposal.id), {}, {
            onSuccess: () => {
                toast.success('Proposal returned to draft');
                router.visit(route('proposals.my.index'));
            },
            onError: () => {
                toast.error('Failed to return proposal to draft');
                setIsReturningToDraft(false);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Category *</Label>
                        <Select
                            value={formData.category_id}
                            onValueChange={(value) => handleChange('category_id', value)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Title *</Label>
                        <Input
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Enter proposal title"
                            required
                        />
                    </div>

                    <div>
                        <Label>Description *</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Describe your proposal"
                            rows={4}
                            required
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Implementation Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Implementation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Start Date *</Label>
                            <Input
                                type="date"
                                value={formData.implementation_start_date}
                                onChange={(e) => handleChange('implementation_start_date', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label>End Date *</Label>
                            <Input
                                type="date"
                                value={formData.implementation_end_date}
                                onChange={(e) => handleChange('implementation_end_date', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Location *</Label>
                        <Input
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            placeholder="Enter implementation location"
                            required
                        />
                    </div>

                    <div>
                        <Label>People Involved *</Label>
                        <Textarea
                            value={formData.people_involved}
                            onChange={(e) => handleChange('people_involved', e.target.value)}
                            placeholder="List the people or groups involved"
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <Label>Target Participants *</Label>
                        <Input
                            type="number"
                            value={formData.target_participants}
                            onChange={(e) => handleChange('target_participants', e.target.value)}
                            placeholder="Enter number of target participants"
                            required
                            min="1"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Budget Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Budget Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Estimated Cost *</Label>
                        <Input
                            type="number"
                            value={formData.estimated_cost}
                            onChange={(e) => handleChange('estimated_cost', e.target.value)}
                            placeholder="Enter estimated cost"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <Label>Frequency *</Label>
                        <Input
                            value={formData.frequency}
                            onChange={(e) => handleChange('frequency', e.target.value)}
                            placeholder="e.g., Weekly, Monthly, Quarterly"
                            required
                        />
                    </div>

                    <div>
                        <Label>Funding Source *</Label>
                        <Input
                            value={formData.funding_source}
                            onChange={(e) => handleChange('funding_source', e.target.value)}
                            placeholder="Enter funding source"
                            required
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Objectives *</Label>
                        <Textarea
                            value={formData.objectives}
                            onChange={(e) => handleChange('objectives', e.target.value)}
                            placeholder="Enter objectives (one per line)"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <Label>Expected Outcomes *</Label>
                        <Textarea
                            value={formData.expected_outcomes}
                            onChange={(e) => handleChange('expected_outcomes', e.target.value)}
                            placeholder="Enter expected outcomes (one per line)"
                            rows={4}
                            required
                        />
                    </div>
                </CardContent>
            </Card>

            {/* File Upload Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Supporting Documents</Label>
                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isSubmitting}
                            >
                                Select Files
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                multiple
                                className="hidden"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                            />
                            <p className="text-sm text-muted-foreground">
                                PDF, Word, Excel, JPG, PNG (Max 10MB each)
                            </p>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-medium">Selected Files:</h4>
                            <ul className="space-y-2">
                                {files.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between p-2 border rounded">
                                        <div className="flex items-center gap-2">
                                            <FileIcon extension={file.name.split('.').pop()?.toLowerCase()} />
                                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-between space-x-4">
                <div className="flex gap-2">
                    {proposal.status !== 'draft' && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleReturnToDraft}
                            disabled={isSubmitting || isReturningToDraft}
                        >
                            {isReturningToDraft ? 'Processing...' : 'Return to Draft'}
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Proposal'}
                    </Button>
                </div>
            </div>
        </form>
    );
}

function FileIcon({ extension }: { extension?: string }) {
    const iconMap: Record<string, string> = {
        pdf: '📄',
        doc: '📝',
        docx: '📝',
        xls: '📊',
        xlsx: '📊',
        jpg: '🖼️',
        jpeg: '🖼️',
        png: '🖼️',
    };

    return <span>{iconMap[extension || ''] || '📁'}</span>;
}