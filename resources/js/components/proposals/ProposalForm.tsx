import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { type ProposalCategory } from '@/types';
import { CalendarIcon, Upload } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';

interface Props {
    categories: ProposalCategory[];
    proposal?: {
        id: string;
        title?: string;
        category_id?: string;
        description?: string;
        estimated_cost?: string;
        frequency?: string;
        funding_source?: string;
        people_involved?: string;
        implementation_start_date?: string;
        implementation_end_date?: string;
        location?: string;
        objectives?: string;
        expected_outcomes?: string;
        target_participants?: number;
        attachments?: Array<{
            id: string;
            filename: string;
            url: string;
        }>;
    } | null;
}

export default function ProposalForm({ categories, proposal = null }: Props) {
    const { data, setData, post, put, processing, progress, errors, setError, clearErrors } = useForm({
        title: proposal?.title || '',
        category_id: proposal?.category_id || '',
        description: proposal?.description || '',
        estimated_cost: proposal?.estimated_cost || '',
        frequency: proposal?.frequency || '',
        funding_source: proposal?.funding_source || '',
        people_involved: proposal?.people_involved || '',
        implementation_start_date: proposal?.implementation_start_date || '',
        implementation_end_date: proposal?.implementation_end_date || '',
        location: proposal?.location || '',
        objectives: proposal?.objectives || '',
        expected_outcomes: proposal?.expected_outcomes || '',
        target_participants: proposal?.target_participants || 0,
        attachments: [] as File[],
    });

    function validateDates() {
        clearErrors();
        let isValid = true;

        // Validate start date
        if (!data.implementation_start_date) {
            setError('implementation_start_date', 'Start date is required');
            isValid = false;
        }

        // Validate end date
        if (!data.implementation_end_date) {
            setError('implementation_end_date', 'End date is required');
            isValid = false;
        }

        // Validate date format and range
        if (data.implementation_start_date && data.implementation_end_date) {
            try {
                const startDate = parseISO(data.implementation_start_date);
                const endDate = parseISO(data.implementation_end_date);

                // Check if end date is after start date
                if (!isAfter(endDate, startDate)) {
                    setError('implementation_end_date', 'End date must be after start date');
                    isValid = false;
                }

                // Check for valid year range (between 2024 and 2100)
                const startYear = startDate.getFullYear();
                const endYear = endDate.getFullYear();
                if (startYear < 2024 || startYear > 2100) {
                    setError('implementation_start_date', 'Please enter a valid year between 2024 and 2100');
                    isValid = false;
                }
                if (endYear < 2024 || endYear > 2100) {
                    setError('implementation_end_date', 'Please enter a valid year between 2024 and 2100');
                    isValid = false;
                }
            } catch (e) {
                setError('implementation_end_date', 'Please enter valid dates');
                isValid = false;
            }
        }

        return isValid;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        if (!validateDates()) {
            return;
        }

        if (proposal) {
            put(route('proposals.my.update', proposal.id));
        } else {
            post(route('proposals.my.store'), {
                forceFormData: true,
                onError: (errors) => {
                    console.error('Form submission errors:', errors);
                }
            });
        }
    }

    function handleDateChange(field: 'implementation_start_date' | 'implementation_end_date', value: string) {
        setData(field, value);
        // Clear errors when user starts typing
        if (errors[field]) {
            clearErrors(field);
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setData('attachments', files);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="implementation_start_date">Start Date</Label>
                    <div className="relative">
                        <Input
                            id="implementation_start_date"
                            type="date"
                            value={data.implementation_start_date}
                            onChange={(e) => handleDateChange('implementation_start_date', e.target.value)}
                            className={errors.implementation_start_date ? 'border-red-500' : ''}
                            min="2024-01-01"
                            max="2100-12-31"
                        />
                        <CalendarIcon className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                    </div>
                    {errors.implementation_start_date && (
                        <p className="text-sm text-red-500">{errors.implementation_start_date}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="implementation_end_date">End Date</Label>
                    <div className="relative">
                        <Input
                            id="implementation_end_date"
                            type="date"
                            value={data.implementation_end_date}
                            onChange={(e) => handleDateChange('implementation_end_date', e.target.value)}
                            className={errors.implementation_end_date ? 'border-red-500' : ''}
                            min={data.implementation_start_date || "2024-01-01"}
                            max="2100-12-31"
                        />
                        <CalendarIcon className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                    </div>
                    {errors.implementation_end_date && (
                        <p className="text-sm text-red-500">{errors.implementation_end_date}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    value={data.location}
                    onChange={(e) => setData('location', e.target.value)}
                    className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="estimated_cost">Estimated Cost</Label>
                    <Input
                        id="estimated_cost"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.estimated_cost}
                        onChange={(e) => setData('estimated_cost', e.target.value)}
                        className={errors.estimated_cost ? 'border-red-500' : ''}
                    />
                    {errors.estimated_cost && <p className="text-sm text-red-500">{errors.estimated_cost}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="target_participants">Target Participants</Label>
                    <Input
                        id="target_participants"
                        type="number"
                        min="1"
                        value={data.target_participants}
                        onChange={(e) => setData('target_participants', e.target.value)}
                        className={errors.target_participants ? 'border-red-500' : ''}
                    />
                    {errors.target_participants && <p className="text-sm text-red-500">{errors.target_participants}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                    id="frequency"
                    value={data.frequency}
                    onChange={(e) => setData('frequency', e.target.value)}
                    className={errors.frequency ? 'border-red-500' : ''}
                    placeholder="e.g., One-time, Monthly, Quarterly"
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
                <Textarea
                    id="people_involved"
                    value={data.people_involved}
                    onChange={(e) => setData('people_involved', e.target.value)}
                    className={errors.people_involved ? 'border-red-500' : ''}
                    placeholder="List the key people and their roles"
                />
                {errors.people_involved && <p className="text-sm text-red-500">{errors.people_involved}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="objectives">Objectives</Label>
                <Textarea
                    id="objectives"
                    value={data.objectives}
                    onChange={(e) => setData('objectives', e.target.value)}
                    className={errors.objectives ? 'border-red-500' : ''}
                    placeholder="What are the main objectives of this proposal?"
                />
                {errors.objectives && <p className="text-sm text-red-500">{errors.objectives}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="expected_outcomes">Expected Outcomes</Label>
                <Textarea
                    id="expected_outcomes"
                    value={data.expected_outcomes}
                    onChange={(e) => setData('expected_outcomes', e.target.value)}
                    className={errors.expected_outcomes ? 'border-red-500' : ''}
                    placeholder="What outcomes do you expect from this proposal?"
                />
                {errors.expected_outcomes && <p className="text-sm text-red-500">{errors.expected_outcomes}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="attachments">Attachments</Label>
                <div className="flex items-center gap-4">
                    <Input
                        id="attachments"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className={errors.attachments ? 'border-red-500' : ''}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                    <Upload className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-sm text-gray-500">
                    Accepted file types: PDF, Word, Excel, Images (JPG, PNG)
                </p>
                {errors.attachments && <p className="text-sm text-red-500">{errors.attachments}</p>}
            </div>

            {progress && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${progress.percentage}%` }}
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
    );
} 