import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function SystemEvaluation() {
    const [selectedRating, setSelectedRating] = useState<string>('');
    
    const { data, setData, post, processing, reset } = useForm({
        rating: '',
        usability_score: '',
        feedback: '',
        suggestions: '',
        would_recommend: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('system.evaluation.submit'), {
            onSuccess: () => {
                reset();
                setSelectedRating('');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="System Evaluation" />

            <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                            System Evaluation
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Overall Experience */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    How would you rate your overall experience?
                                </h2>
                                <RadioGroup
                                    value={data.rating}
                                    onValueChange={(value) => setData('rating', value)}
                                    className="flex space-x-4"
                                >
                                    {['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'].map((rating) => (
                                        <div key={rating} className="flex items-center space-x-2">
                                            <RadioGroupItem value={rating} id={rating} />
                                            <Label htmlFor={rating}>{rating}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Usability Score */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    How easy is it to use the system? (1-10)
                                </h2>
                                <RadioGroup
                                    value={data.usability_score}
                                    onValueChange={(value) => setData('usability_score', value)}
                                    className="grid grid-cols-5 gap-4"
                                >
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i + 1} className="flex items-center space-x-2">
                                            <RadioGroupItem value={(i + 1).toString()} id={`score-${i + 1}`} />
                                            <Label htmlFor={`score-${i + 1}`}>{i + 1}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Feedback */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    What aspects of the system do you like or dislike?
                                </h2>
                                <Textarea
                                    value={data.feedback}
                                    onChange={(e) => setData('feedback', e.target.value)}
                                    rows={4}
                                    placeholder="Share your thoughts about the system..."
                                />
                            </div>

                            {/* Suggestions */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Do you have any suggestions for improvement?
                                </h2>
                                <Textarea
                                    value={data.suggestions}
                                    onChange={(e) => setData('suggestions', e.target.value)}
                                    rows={4}
                                    placeholder="Your suggestions will help us improve..."
                                />
                            </div>

                            {/* Would Recommend */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Would you recommend this system to others?
                                </h2>
                                <RadioGroup
                                    value={data.would_recommend ? 'yes' : 'no'}
                                    onValueChange={(value) => setData('would_recommend', value === 'yes')}
                                    className="flex space-x-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id="recommend-yes" />
                                        <Label htmlFor="recommend-yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="recommend-no" />
                                        <Label htmlFor="recommend-no">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                Submit Evaluation
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 