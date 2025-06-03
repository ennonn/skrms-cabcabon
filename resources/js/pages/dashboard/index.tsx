import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth';
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock,
    DollarSign,
    FileText,
} from 'lucide-react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface DashboardData {
    metrics: {
        total_proposals: number;
        pending_proposals: number;
        approved_proposals: number;
        total_budget: number;
    };
    monthly_submissions: {
        labels: string[];
        data: number[];
    };
    status_distribution: {
        labels: string[];
        data: number[];
    };
    category_budget: {
        labels: string[];
        data: number[];
    };
    approval_trend: {
        labels: string[];
        data: number[];
    };
}

interface Props {
    dashboard: DashboardData;
}

export default function Dashboard({ dashboard }: Props) {
    const { user } = useAuth();

    const MetricCard = ({ title, value, icon: Icon, description }: any) => (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h3 className="text-2xl font-bold mt-2">{value}</h3>
                        {description && (
                            <p className="text-sm text-muted-foreground mt-1">{description}</p>
                        )}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <AppLayout>
            <div className="p-6 space-y-6">
                {/* Metrics Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Total Proposals"
                        value={dashboard.metrics.total_proposals}
                        icon={FileText}
                        description="All time submissions"
                    />
                    <MetricCard
                        title="Pending Approvals"
                        value={dashboard.metrics.pending_proposals}
                        icon={Clock}
                        description="Awaiting review"
                    />
                    <MetricCard
                        title="Approved Proposals"
                        value={dashboard.metrics.approved_proposals}
                        icon={CheckCircle2}
                        description="Successfully approved"
                    />
                    <MetricCard
                        title="Total Budget"
                        value={`₱${dashboard.metrics.total_budget.toLocaleString()}`}
                        icon={DollarSign}
                        description="Allocated funding"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Monthly Submissions Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Submissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Line
                                data={{
                                    labels: dashboard.monthly_submissions.labels,
                                    datasets: [
                                        {
                                            label: 'Submissions',
                                            data: dashboard.monthly_submissions.data,
                                            borderColor: 'rgb(99, 102, 241)',
                                            tension: 0.4,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                                height={300}
                            />
                        </CardContent>
                    </Card>

                    {/* Proposal Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Pie
                                data={{
                                    labels: dashboard.status_distribution.labels,
                                    datasets: [
                                        {
                                            data: dashboard.status_distribution.data,
                                            backgroundColor: [
                                                'rgb(99, 102, 241)',
                                                'rgb(34, 197, 94)',
                                                'rgb(239, 68, 68)',
                                                'rgb(234, 179, 8)',
                                            ],
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                                height={300}
                            />
                        </CardContent>
                    </Card>

                    {/* Budget by Category */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Budget by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Bar
                                data={{
                                    labels: dashboard.category_budget.labels,
                                    datasets: [
                                        {
                                            label: 'Budget Allocation',
                                            data: dashboard.category_budget.data,
                                            backgroundColor: 'rgb(99, 102, 241)',
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                                height={300}
                            />
                        </CardContent>
                    </Card>

                    {/* Approval Rate Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Approval Rate Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Line
                                data={{
                                    labels: dashboard.approval_trend.labels,
                                    datasets: [
                                        {
                                            label: 'Approval Rate',
                                            data: dashboard.approval_trend.data,
                                            borderColor: 'rgb(34, 197, 94)',
                                            tension: 0.4,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 100,
                                            ticks: {
                                                callback: (value) => `${value}%`,
                                            },
                                        },
                                    },
                                }}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 