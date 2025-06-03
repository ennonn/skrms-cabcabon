import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
    categories?: any[];
    proposal?: {
        id?: number;
        proposal_category_id?: string | number;
        title?: string;
        description?: string;
        implementation_start_date?: string;
        implementation_end_date?: string;
        location?: string;
        people_involved?: string;
        target_participants?: string | number;
        estimated_cost?: string | number;
        frequency?: string;
        funding_source?: string;
        objectives?: string | string[];
        expected_outcomes?: string | string[];
        is_admin_edit?: boolean;
        [key: string]: any;
    };
    isEditing?: boolean;
    onSuccess?: () => void;
    customRoutes?: {
        update?: string;
        store?: string;
        successRedirect?: string;
    };
}

export function ProposalForm({ categories = [], proposal, isEditing = false, onSuccess, customRoutes }: Props) {
    const [data, setData] = useState({
        // Basic Information
        proposal_category_id: proposal?.proposal_category_id?.toString() ?? '',
        title: proposal?.title ?? '',
        description: proposal?.description ?? '',

        // Implementation Details
        implementation_start_date: proposal?.implementation_start_date ?? '',
        implementation_end_date: proposal?.implementation_end_date ?? '',
        location: proposal?.location ?? '',
        people_involved: proposal?.people_involved ?? '',
        target_participants: proposal?.target_participants?.toString() ?? '',

        // Budget Details
        estimated_cost: proposal?.estimated_cost?.toString() ?? '',
        frequency: proposal?.frequency ?? '',
        funding_source: proposal?.funding_source ?? '',

        // Additional Information
        objectives: Array.isArray(proposal?.objectives) 
            ? proposal.objectives.join('\n') 
            : proposal?.objectives ?? '',
        expected_outcomes: Array.isArray(proposal?.expected_outcomes) 
            ? proposal.expected_outcomes.join('\n') 
            : proposal?.expected_outcomes ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields: Record<string, string> = {
            proposal_category_id: 'Category',
            title: 'Title',
            description: 'Description',
            implementation_start_date: 'Start Date',
            implementation_end_date: 'End Date',
            location: 'Location',
            people_involved: 'People Involved',
            target_participants: 'Target Participants',
            estimated_cost: 'Estimated Cost',
            frequency: 'Frequency',
            funding_source: 'Funding Source',
            objectives: 'Objectives',
            expected_outcomes: 'Expected Outcomes',
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !data[key as keyof typeof data])
            .map(([, label]) => label);

        if (missingFields.length > 0) {
            toast.error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
            return;
        }

        if (isEditing && proposal) {
            // Always use provided custom routes for clarity
            if (!customRoutes?.update) {
                console.warn('No update route provided in customRoutes. Form submission may fail.');
            }
            if (!customRoutes?.successRedirect) {
                console.warn('No successRedirect route provided in customRoutes. Navigation after submission may fail.');
            }
            
            const updateRoute = customRoutes?.update;
            const redirectRoute = customRoutes?.successRedirect;
            
            if (!updateRoute) {
                toast.error('Update route not configured. Please contact support.');
                return;
            }
            
            router.put(updateRoute, data, {
                onSuccess: () => {
                    toast.success('Proposal updated successfully');
                    if (onSuccess) {
                        onSuccess();
                    } else if (redirectRoute) {
                        router.visit(redirectRoute);
                    }
                },
                onError: (errors) => {
                    toast.error('Failed to update proposal. Please check the form and try again.');
                    console.error('Update errors:', errors);
                }
            });
        } else {
            // For new proposals, also rely solely on customRoutes
            if (!customRoutes?.store) {
                console.warn('No store route provided in customRoutes. Form submission may fail.');
            }
            if (!customRoutes?.successRedirect) {
                console.warn('No successRedirect route provided in customRoutes. Navigation after submission may fail.');
            }
            
            const storeRoute = customRoutes?.store;
            const redirectRoute = customRoutes?.successRedirect;
            
            if (!storeRoute) {
                toast.error('Store route not configured. Please contact support.');
                return;
            }
            
            router.post(storeRoute, data, {
                onSuccess: (page) => {
                    toast.success('Proposal created successfully');
                    if (onSuccess) {
                        onSuccess();
                    } else if (redirectRoute) {
                        router.visit(redirectRoute);
                    }
                },
                onError: (errors) => {
                    toast.error('Failed to create proposal. Please check the form and try again.');
                    console.error('Creation errors:', errors);
                }
            });
        }
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
                        <Label>Category</Label>
                        <Select
                            value={data.proposal_category_id}
                            onValueChange={(value) => setData({ ...data, proposal_category_id: value })}
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
                        <Label>Title</Label>
                        <Input
                            value={data.title}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            placeholder="Enter proposal title"
                        />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            placeholder="Describe your proposal"
                            rows={4}
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
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={data.implementation_start_date}
                                onChange={(e) => setData({ ...data, implementation_start_date: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                value={data.implementation_end_date}
                                onChange={(e) => setData({ ...data, implementation_end_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Location</Label>
                        <Input
                            value={data.location}
                            onChange={(e) => setData({ ...data, location: e.target.value })}
                            placeholder="Enter implementation location"
                        />
                    </div>

                    <div>
                        <Label>People Involved</Label>
                        <Textarea
                            value={data.people_involved}
                            onChange={(e) => setData({ ...data, people_involved: e.target.value })}
                            placeholder="List the people or groups involved"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label>Target Participants</Label>
                        <Input
                            type="number"
                            value={data.target_participants}
                            onChange={(e) => setData({ ...data, target_participants: e.target.value })}
                            placeholder="Enter number of target participants"
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
                        <Label>Estimated Cost</Label>
                        <Input
                            type="number"
                            value={data.estimated_cost}
                            onChange={(e) => setData({ ...data, estimated_cost: e.target.value })}
                            placeholder="Enter estimated cost"
                        />
                    </div>

                    <div>
                        <Label>Frequency</Label>
                        <Input
                            value={data.frequency}
                            onChange={(e) => setData({ ...data, frequency: e.target.value })}
                            placeholder="e.g., Weekly, Monthly, Quarterly"
                        />
                    </div>

                    <div>
                        <Label>Funding Source</Label>
                        <Input
                            value={data.funding_source}
                            onChange={(e) => setData({ ...data, funding_source: e.target.value })}
                            placeholder="Enter funding source"
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
                        <Label>Objectives</Label>
                        <Textarea
                            value={data.objectives}
                            onChange={(e) => setData({ ...data, objectives: e.target.value })}
                            placeholder="Enter objectives (one per line)"
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label>Expected Outcomes</Label>
                        <Textarea
                            value={data.expected_outcomes}
                            onChange={(e) => setData({ ...data, expected_outcomes: e.target.value })}
                            placeholder="Enter expected outcomes (one per line)"
                            rows={4}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
                <Button type="submit">
                    {isEditing ? 'Update Proposal' : 'Create Proposal'}
                </Button>
            </div>
        </form>
    );
} 