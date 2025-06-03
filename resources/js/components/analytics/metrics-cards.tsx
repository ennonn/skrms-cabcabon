import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Percent, TrendingUp } from "lucide-react"

interface MetricsCardsProps {
    metrics: {
        total_logins: number;
        active_users: number;
        user_engagement_rate: number;
        avg_daily_active_users: number;
    }
}

const METRIC_ICONS = {
    total_logins: Activity,
    active_users: Users,
    user_engagement_rate: Percent,
    avg_daily_active_users: TrendingUp,
}

const formatMetricValue = (key: string, value: number): string => {
    switch (key) {
        case 'user_engagement_rate':
            return `${value}%`
        case 'avg_daily_active_users':
            return value.toFixed(1)
        default:
            return value.toLocaleString()
    }
}

const formatMetricLabel = (key: string): string => {
    return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
            {Object.entries(metrics).map(([key, value]) => {
                const Icon = METRIC_ICONS[key as keyof typeof METRIC_ICONS]
                return (
                    <Card key={key}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {formatMetricLabel(key)}
                            </CardTitle>
                            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatMetricValue(key, value)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Last 30 days
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
} 