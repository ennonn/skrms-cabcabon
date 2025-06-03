import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { PieChartDonutWithText } from '@/components/charts/pie-chart-donut-with-text';
import { LineChartLinear } from '@/components/charts/line-chart-linear';
import { BarChart } from '@/components/charts/bar-chart';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Users, FileText, CheckCircle, UserCheck } from 'lucide-react';

interface AdminDashboardProps {
    stats: {
        total_users: { value: number; trend: number; trend_text: string; trend_direction: string };
        total_proposals: { value: number; trend: number; trend_text: string; trend_direction: string };
        approved_proposals: { value: number; trend: number; trend_text: string; trend_direction: string };
        registered_youth: { value: number; trend: number; trend_text: string; trend_direction: string };
    };
    categoryBudgets: Array<{ category: string; value: number }>;
    statusCounts: {
        proposals: {
            approved: number;
            pending: number;
            rejected: number;
        };
        youth: {
            approved: number;
            pending: number;
            rejected: number;
        };
    };
    recentProposals: {
        approved: Array<{
            id: number;
            title: string;
            status: string;
            submitted_by: string;
            created_at: string;
        }>;
        pending: Array<{
            id: number;
            title: string;
            status: string;
            submitted_by: string;
            created_at: string;
        }>;
        rejected: Array<{
            id: number;
            title: string;
            status: string;
            submitted_by: string;
            created_at: string;
        }>;
    };
    recentYouth: {
        approved: Array<{
            id: number;
            name: string;
            status: string;
            created_at: string;
        }>;
        pending: Array<{
            id: number;
            name: string;
            status: string;
            created_at: string;
        }>;
        rejected: Array<{
            id: number;
            name: string;
            status: string;
            created_at: string;
        }>;
    };
    proposalFrequency: Array<{ month: string; value: number }>;
    proposalCategories: Array<{ category: string; count: number }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard({ 
    stats, 
    categoryBudgets, 
    statusCounts, 
    recentProposals, 
    recentYouth,
    proposalFrequency,
    proposalCategories 
}: AdminDashboardProps) {
    // Calculate total budget
    const totalBudget = categoryBudgets.reduce((sum, item) => sum + item.value, 0);

    // Transform category budgets data for donut chart
    const categoryBudgetsData = {
        labels: categoryBudgets.map(item => item.category),
        datasets: [{
            data: categoryBudgets.map(item => item.value),
            backgroundColor: [
                'rgb(37, 99, 235)',    // Blue
                'rgb(147, 197, 253)',  // Light Blue
                'rgb(96, 165, 250)',   // Medium Blue
                'rgb(59, 130, 246)',   // Bright Blue
                'rgb(29, 78, 216)',    // Dark Blue
                'rgb(30, 64, 175)',    // Darker Blue
                'rgb(30, 58, 138)',    // Darkest Blue
            ],
            borderWidth: 0,
            borderRadius: 2,
        }]
    };

    // Calculate total proposals
    const totalProposals = statusCounts.proposals.approved + statusCounts.proposals.pending + statusCounts.proposals.rejected;

    // Transform proposal status data for donut chart
    const proposalStatusData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [{
            data: [
                statusCounts.proposals.approved,
                statusCounts.proposals.pending,
                statusCounts.proposals.rejected
            ],
            backgroundColor: [
                'rgb(34, 197, 94)',   // Green
                'rgb(234, 179, 8)',   // Yellow
                'rgb(239, 68, 68)',   // Red
            ],
            borderWidth: 0,
            borderRadius: 2,
        }]
    };

    // Calculate total youth profiles
    const totalYouth = statusCounts.youth.approved + statusCounts.youth.pending + statusCounts.youth.rejected;

    // Transform youth profile status data for donut chart
    const youthStatusData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [{
            data: [
                statusCounts.youth.approved,
                statusCounts.youth.pending,
                statusCounts.youth.rejected
            ],
            backgroundColor: [
                'rgb(34, 197, 94)',   // Green
                'rgb(234, 179, 8)',   // Yellow
                'rgb(239, 68, 68)',   // Red
            ],
            borderWidth: 0,
            borderRadius: 2,
        }]
    };

    // Transform proposal categories data for bar chart
    const proposalCategoriesData = {
        labels: proposalCategories.map(item => item.category),
        datasets: [{
            label: 'Number of Proposals',
            data: proposalCategories.map(item => item.count),
            backgroundColor: 'rgb(37, 99, 235)', // Blue
            borderColor: 'rgb(37, 99, 235)',
            borderWidth: 0,
            borderRadius: 4
        }]
    };

    // Transform proposal frequency data for line chart
    const proposalFrequencyData = {
        labels: proposalFrequency.map(item => item.month),
        datasets: [{
            label: 'Number of Proposals',
            data: proposalFrequency.map(item => item.value),
            borderColor: 'rgb(37, 99, 235)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4
        }]
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl border bg-card p-4 text-card-foreground shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                <h3 className="mt-2 text-2xl font-bold">{stats.total_users.value}</h3>
                            </div>
                            <div className="rounded-full bg-primary/20 p-2">
                                <Users className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                            <span className="font-medium">{stats.total_users.trend}</span>
                            <span className="ml-1">{stats.total_users.trend_text}</span>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-4 text-card-foreground shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Proposals</p>
                                <h3 className="mt-2 text-2xl font-bold">{stats.total_proposals.value}</h3>
                            </div>
                            <div className="rounded-full bg-primary/20 p-2">
                                <FileText className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                            <span className="font-medium">{stats.total_proposals.trend}</span>
                            <span className="ml-1">{stats.total_proposals.trend_text}</span>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-4 text-card-foreground shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Approved Proposals</p>
                                <h3 className="mt-2 text-2xl font-bold">{stats.approved_proposals.value}</h3>
                            </div>
                            <div className="rounded-full bg-primary/20 p-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                            <span className="font-medium">{stats.approved_proposals.trend}</span>
                            <span className="ml-1">{stats.approved_proposals.trend_text}</span>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-4 text-card-foreground shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Registered Youth</p>
                                <h3 className="mt-2 text-2xl font-bold">{stats.registered_youth.value}</h3>
                            </div>
                            <div className="rounded-full bg-primary/20 p-2">
                                <UserCheck className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                            <span className="font-medium">{stats.registered_youth.trend}</span>
                            <span className="ml-1">{stats.registered_youth.trend_text}</span>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                {/* Category Budget Chart */}
                <div className="grid gap-4">
                    <div className="col-span-1">
                        <PieChartDonutWithText
                            title="Category Budgets"
                            description="Budget allocation by category for approved proposals"
                            data={categoryBudgetsData}
                            centerText={{
                                value: formatCurrency(totalBudget),
                                label: "Total Budget"
                            }}
                            height={300}
                        />
                    </div>
                </div>

                {/* Status Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="col-span-1">
                        <PieChartDonutWithText
                            title="Proposal Status"
                            description="Distribution of proposals by status"
                            data={proposalStatusData}
                            centerText={{
                                value: totalProposals.toString(),
                                label: "Total Proposals"
                            }}
                            height={300}
                        />
                    </div>
                    <div className="col-span-1">
                        <PieChartDonutWithText
                            title="Youth Profile Status"
                            description="Distribution of youth profiles by status"
                            data={youthStatusData}
                            centerText={{
                                value: totalYouth.toString(),
                                label: "Total Profiles"
                            }}
                            height={300}
                        />
                    </div>
                </div>

                {/* Categories and Frequency Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                        <BarChart
                            title="Proposal Categories"
                            description="Number of proposals by category"
                            data={proposalCategoriesData}
                            height={350}
                        />
                    </Card>
                    <Card className="p-4">
                        <LineChartLinear
                            title="Proposal Submission Frequency"
                            description={`${proposalFrequency[0].month} - ${proposalFrequency[proposalFrequency.length - 1].month}`}
                            data={proposalFrequencyData}
                            height={350}
                            trendText="Monthly submission trends"
                            footerText="Last 6 months"
                        />
                    </Card>
                </div>

                {/* Recent Proposals */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="p-4">
                        <h3 className="mb-4 text-lg font-semibold">Recently Approved Proposals</h3>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => {
                                const proposal = recentProposals.approved[index];
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        {proposal ? (
                                            <>
                                                <div>
                                                    <p className="font-medium">{proposal.title}</p>
                                                    <p className="text-sm text-gray-500">by {proposal.submitted_by}</p>
                                                </div>
                                                <p className="text-sm text-gray-500">{formatDate(proposal.created_at)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <div className="h-5 w-32 bg-gray-100 rounded animate-pulse"></div>
                                                    <div className="h-4 w-24 bg-gray-50 rounded mt-1 animate-pulse"></div>
                                                </div>
                                                <div className="h-4 w-20 bg-gray-50 rounded animate-pulse"></div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                    <Card className="p-4">
                        <h3 className="mb-4 text-lg font-semibold">Recently Submitted Proposals</h3>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => {
                                const proposal = recentProposals.pending[index];
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        {proposal ? (
                                            <>
                                                <div>
                                                    <p className="font-medium">{proposal.title}</p>
                                                    <p className="text-sm text-gray-500">by {proposal.submitted_by}</p>
                                                </div>
                                                <p className="text-sm text-gray-500">{formatDate(proposal.created_at)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <div className="h-5 w-32 bg-gray-100 rounded animate-pulse"></div>
                                                    <div className="h-4 w-24 bg-gray-50 rounded mt-1 animate-pulse"></div>
                                                </div>
                                                <div className="h-4 w-20 bg-gray-50 rounded animate-pulse"></div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                    <Card className="p-4">
                        <h3 className="mb-4 text-lg font-semibold">Recently Rejected Proposals</h3>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => {
                                const proposal = recentProposals.rejected[index];
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        {proposal ? (
                                            <>
                                                <div>
                                                    <p className="font-medium">{proposal.title}</p>
                                                    <p className="text-sm text-gray-500">by {proposal.submitted_by}</p>
                                                </div>
                                                <p className="text-sm text-gray-500">{formatDate(proposal.created_at)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <div className="h-5 w-32 bg-gray-100 rounded animate-pulse"></div>
                                                    <div className="h-4 w-24 bg-gray-50 rounded mt-1 animate-pulse"></div>
                                                </div>
                                                <div className="h-4 w-20 bg-gray-50 rounded animate-pulse"></div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Recent Youth Profiles */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="p-4">
                        <h3 className="mb-4 text-lg font-semibold">Recently Registered Youth</h3>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => {
                                const profile = recentYouth.approved[index];
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        {profile ? (
                                            <>
                                                <div>
                                                    <p className="font-medium">{profile.name}</p>
                                                    <Badge variant="success">Approved</Badge>
                                                </div>
                                                <p className="text-sm text-gray-500">{formatDate(profile.created_at)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <div className="h-5 w-32 bg-gray-100 rounded animate-pulse"></div>
                                                    <div className="h-6 w-20 bg-green-50 rounded mt-1 animate-pulse"></div>
                                                </div>
                                                <div className="h-4 w-20 bg-gray-50 rounded animate-pulse"></div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                    <Card className="p-4">
                        <h3 className="mb-4 text-lg font-semibold">Pending Youth Registrations</h3>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => {
                                const profile = recentYouth.pending[index];
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        {profile ? (
                                            <>
                                                <div>
                                                    <p className="font-medium">{profile.name}</p>
                                                    <Badge variant="warning">Pending</Badge>
                                                </div>
                                                <p className="text-sm text-gray-500">{formatDate(profile.created_at)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <div className="h-5 w-32 bg-gray-100 rounded animate-pulse"></div>
                                                    <div className="h-6 w-20 bg-yellow-50 rounded mt-1 animate-pulse"></div>
                                                </div>
                                                <div className="h-4 w-20 bg-gray-50 rounded animate-pulse"></div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                    <Card className="p-4">
                        <h3 className="mb-4 text-lg font-semibold">Rejected Youth Registrations</h3>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => {
                                const profile = recentYouth.rejected[index];
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        {profile ? (
                                            <>
                                                <div>
                                                    <p className="font-medium">{profile.name}</p>
                                                    <Badge variant="destructive">Rejected</Badge>
                                                </div>
                                                <p className="text-sm text-gray-500">{formatDate(profile.created_at)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <div className="h-5 w-32 bg-gray-100 rounded animate-pulse"></div>
                                                    <div className="h-6 w-20 bg-red-50 rounded mt-1 animate-pulse"></div>
                                                </div>
                                                <div className="h-4 w-20 bg-gray-50 rounded animate-pulse"></div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 