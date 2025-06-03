import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PageProps {
    auth: {
        user: any;
    };
    categories: Array<{
        id: string;
        name: string;
    }>;
    proposal?: {
        id: string;
        title?: string;
        category_id?: string;
        description?: string;
        estimated_cost?: string;
        frequency?: string;
        funding_source?: string;
        people_involved?: string;
        attachments?: Array<{
            id: string;
            filename: string;
            url: string;
        }>;
    } | null;
}

export default function CreateEditProposalPage({ auth, categories, proposal = null }: PageProps) {
    const { data, setData, post, put, processing, errors, progress } = useForm({
        title: proposal?.title || '',
        category_id: proposal?.category_id || '',
        description: proposal?.description || '',
        estimated_cost: proposal?.estimated_cost || '',
        frequency: proposal?.frequency || '',
        funding_source: proposal?.funding_source || '',
        people_involved: proposal?.people_involved || '',
        attachments: [] as File[],
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (proposal) {
            put(route('proposals.my.update', proposal.id));
        } else {
            post(route('proposals.my.store'), {
                forceFormData: true,
            });
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setData('attachments', files);
        }
    }

    return (
        <AppLayout>
            <Head title={proposal ? 'Edit Proposal' : 'Create Proposal'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                {proposal ? 'Edit Proposal' : 'Create New Proposal'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={data.category_id} onValueChange={(value: string) => setData('category_id', value)}>
                                            <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className={errors.title ? 'border-red-500' : ''}
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={errors.description ? 'border-red-500' : ''}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="estimated_cost">Estimated Cost</Label>
                                    <Input
                                        id="estimated_cost"
                                        value={data.estimated_cost}
                                        onChange={(e) => setData('estimated_cost', e.target.value)}
                                        className={errors.estimated_cost ? 'border-red-500' : ''}
                                    />
                                    {errors.estimated_cost && <p className="text-sm text-red-500">{errors.estimated_cost}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="frequency">Frequency</Label>
                                    <Input
                                        id="frequency"
                                        value={data.frequency}
                                        onChange={(e) => setData('frequency', e.target.value)}
                                        className={errors.frequency ? 'border-red-500' : ''}
                                    />
                                    {errors.frequency && <p className="text-sm text-red-500">{errors.frequency}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="funding_source">Funding Source</Label>
                                    <Input
                                        id="funding_source"
                                        value={data.funding_source}
                                        onChange={(e) => setData('funding_source', e.target.value)}
                                        className={errors.funding_source ? 'border-red-500' : ''}
                                    />
                                    {errors.funding_source && <p className="text-sm text-red-500">{errors.funding_source}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="people_involved">People Involved</Label>
                                    <Input
                                        id="people_involved"
                                        value={data.people_involved}
                                        onChange={(e) => setData('people_involved', e.target.value)}
                                        className={errors.people_involved ? 'border-red-500' : ''}
                                    />
                                    {errors.people_involved && <p className="text-sm text-red-500">{errors.people_involved}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="attachments">Attachments</Label>
                                    <Input
                                        id="attachments"
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className={errors.attachments ? 'border-red-500' : ''}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                    />
                                    {errors.attachments && <p className="text-sm text-red-500">{errors.attachments}</p>}
                                    <p className="text-sm text-gray-500">
                                        Accepted file types: PDF, Word, Excel, Images (JPG, PNG)
                                    </p>
                                </div>

                                {progress && (
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                )}

                                {proposal?.attachments && proposal.attachments.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Current Attachments</Label>
                                        <div className="space-y-2">
                                            {proposal.attachments.map((attachment) => (
                                                <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <span>{attachment.filename}</span>
                                                    <a 
                                                        href={attachment.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        Download
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {proposal ? 'Update Proposal' : 'Create Proposal'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 