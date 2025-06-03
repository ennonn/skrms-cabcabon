import { LineChartLinear } from '@/components/charts/line-chart-linear';
import { BarChart } from '@/components/charts/bar-chart';
import { PieChartDonutWithText } from '@/components/charts/pie-chart-donut-with-text';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, FileText, CheckCircle, UserCheck } from 'lucide-react';

interface DashboardProps {
    stats: {
        total_users: {
            value: number;
            trend: number;
            trend_text: string;
            trend_direction: 'up' | 'down' | 'neutral';
        };
        my_proposals: {
            value: number;
            trend: number;
            trend_text: string;
            trend_direction: 'up' | 'down' | 'neutral';
        };
        approved_proposals: {
            value: number;
            trend: number;
            trend_text: string;
            trend_direction: 'up' | 'down' | 'neutral';
        };
        registered_youth: {
            value: number;
            trend: number;
            trend_text: string;
            trend_direction: 'up' | 'down' | 'neutral';
        };
    };
    chartData: {
        monthly_stats: Array<{
            month: string;
            value: number;
        }>;
        proposal_status: Array<{ label: string; value: number }>;
        youth_profile_status: Array<{ label: string; value: number }>;
        proposal_categories: Array<{ category: string; value: number }>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stats, chartData }: DashboardProps) {
    // Transform proposal categories data for bar chart
    const proposalCategoriesData = {
        labels: chartData.proposal_categories.map(item => item.category),
        datasets: [{
            label: 'Number of Proposals',
            data: chartData.proposal_categories.map(item => item.value),
            backgroundColor: 'rgb(37, 99, 235)', // Solid blue color
            borderColor: 'rgb(37, 99, 235)',
            borderWidth: 0,
            borderRadius: 4
        }]
    };

    // Transform monthly stats data for line chart
    const monthlyStatsData = {
        labels: chartData.monthly_stats.map(item => item.month),
        datasets: [{
            label: 'Number of Proposals',
            data: chartData.monthly_stats.map(item => item.value),
            borderColor: 'hsl(var(--primary))',
            tension: 0.4,
            fill: false,
            borderWidth: 2,
            pointBackgroundColor: 'hsl(var(--primary))',
            pointBorderColor: 'hsl(var(--background))',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

    // Calculate total proposals for the donut chart center
    const totalProposals = chartData.proposal_status.reduce((sum, item) => sum + item.value, 0);

    // Transform proposal status data for donut chart
    const proposalStatusData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [{
            data: [
                chartData.proposal_status.find(item => item.label === 'Approved Proposals')?.value || 0,
                chartData.proposal_status.find(item => item.label === 'Pending Proposals')?.value || 0,
                chartData.proposal_status.find(item => item.label === 'Rejected Proposals')?.value || 0
            ],
            backgroundColor: [
                'rgb(37, 99, 235)',     // Blue 100%
                'rgb(147, 197, 253)',   // Blue 50%
                'rgb(96, 165, 250)',    // Blue 75%
            ],
            borderWidth: 0,
            borderRadius: 2,
        }]
    };

    // Calculate total youth profiles for the donut chart center
    const totalYouthProfiles = chartData.youth_profile_status.reduce((sum, item) => sum + item.value, 0);

    // Transform youth profile status data for donut chart
    const youthProfileStatusData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [{
            data: [
                chartData.youth_profile_status.find(item => item.label === 'Approved Profiles')?.value || 0,
                chartData.youth_profile_status.find(item => item.label === 'Pending Profiles')?.value || 0,
                chartData.youth_profile_status.find(item => item.label === 'Rejected Profiles')?.value || 0
            ],
            backgroundColor: [
                'rgb(37, 99, 235)',     // Blue 100%
                'rgb(147, 197, 253)',   // Blue 50%
                'rgb(96, 165, 250)',    // Blue 75%
            ],
            borderWidth: 0,
            borderRadius: 2,
        }]
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Stats Row */}
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
                                <p className="text-sm font-medium text-muted-foreground">My Proposals</p>
                                <h3 className="mt-2 text-2xl font-bold">{stats.my_proposals.value}</h3>
                            </div>
                            <div className="rounded-full bg-primary/20 p-2">
                                <FileText className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                            <span className="font-medium">{stats.my_proposals.trend}</span>
                            <span className="ml-1">{stats.my_proposals.trend_text}</span>
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
                                <p className="text-sm font-medium text-muted-foreground">Registered Youth Profile</p>
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

                {/* Charts Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {/* Proposal Categories (Bar Chart) */}
                    <div className="col-span-1">
                        <BarChart
                            title="Proposal Categories"
                            description="Distribution by category"
                            data={proposalCategoriesData}
                            height={300}
                        />
                    </div>

                    {/* Proposal Status (Donut Chart) */}
                    <div className="col-span-1">
                        <PieChartDonutWithText
                            title="Proposal Status"
                            description="Distribution of proposals by status"
                            data={{
                                labels: proposalStatusData.labels,
                                datasets: proposalStatusData.datasets
                            }}
                            centerText={{
                                value: totalProposals,
                                label: "Total Proposals"
                            }}
                            height={300}
                        />
                    </div>

                    {/* Monthly Proposal Frequency (Line Chart) */}
                    <div className="col-span-1">
                        <LineChartLinear
                            title="Monthly Proposal Frequency"
                            description={`${monthlyStatsData.labels[0]} - ${monthlyStatsData.labels[monthlyStatsData.labels.length - 1]}`}
                            data={{
                                labels: monthlyStatsData.labels,
                                datasets: [{
                                    label: 'Number of Proposals',
                                    data: monthlyStatsData.datasets[0].data,
                                    borderColor: 'rgb(37, 99, 235)',
                                    backgroundColor: 'transparent',
                                    borderWidth: 2,
                                    pointRadius: 4,
                                    pointHoverRadius: 6,
                                    tension: 0.4
                                }]
                            }}
                            height={300}
                            trendText="Trending up by 5.2% this month"
                            footerText="Showing total proposals for the last 6 months"
                        />
                    </div>

                    {/* Youth Profile Status (Donut Chart) */}
                    <div className="col-span-1">
                        <PieChartDonutWithText
                            title="Youth Profile Status"
                            description="Distribution of youth profiles by status"
                            data={{
                                labels: youthProfileStatusData.labels,
                                datasets: youthProfileStatusData.datasets
                            }}
                            centerText={{
                                value: totalYouthProfiles,
                                label: "Total Youth Profiles"
                            }}
                            height={300}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
