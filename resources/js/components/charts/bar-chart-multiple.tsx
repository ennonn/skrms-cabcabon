"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface ChartDataPoint {
  month: string
  desktop: number
  mobile: number
}

const chartData: ChartDataPoint[] = [
  { month: "Jan", desktop: 650, mobile: 435 },
  { month: "Feb", desktop: 824, mobile: 500 },
  { month: "Mar", desktop: 584, mobile: 500 },
  { month: "Apr", desktop: 950, mobile: 700 },
  { month: "May", desktop: 743, mobile: 500 },
  { month: "Jun", desktop: 776, mobile: 500 },
  { month: "Jul", desktop: 832, mobile: 600 },
  { month: "Aug", desktop: 923, mobile: 600 },
  { month: "Sep", desktop: 967, mobile: 900 },
  { month: "Oct", desktop: 888, mobile: 800 },
  { month: "Nov", desktop: 912, mobile: 1000 },
  { month: "Dec", desktop: 838, mobile: 800 },
]

export function BarChartMultiple() {
  const chartDataConfig = {
    labels: chartData.map(item => item.month),
    datasets: [
      {
        label: 'Desktop',
        data: chartData.map(item => item.desktop),
        backgroundColor: 'hsl(var(--primary) / 0.2)',
        borderColor: 'hsl(var(--primary))',
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: 'hsl(var(--primary) / 0.3)',
        hoverBorderColor: 'hsl(var(--primary))',
      },
      {
        label: 'Mobile',
        data: chartData.map(item => item.mobile),
        backgroundColor: 'hsl(var(--destructive) / 0.2)',
        borderColor: 'hsl(var(--destructive))',
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: 'hsl(var(--destructive) / 0.3)',
        hoverBorderColor: 'hsl(var(--destructive))',
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Usage</CardTitle>
        <CardDescription>
          Monthly active users by platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <Bar
            data={chartDataConfig}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index' as const,
                intersect: false,
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  border: {
                    display: false,
                  },
                  ticks: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
                  },
                },
                y: {
                  border: {
                    display: false,
                    dash: [4, 4],
                  },
                  grid: {
                    color: 'hsl(var(--border) / 0.2)',
                  },
                  ticks: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
                    callback: (value) => value.toLocaleString(),
                  },
                },
              },
              plugins: {
                legend: {
                  position: 'top' as const,
                  labels: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
                    boxWidth: 16,
                    boxHeight: 16,
                    useBorderRadius: true,
                    borderRadius: 4,
                  },
                },
                tooltip: {
                  backgroundColor: 'hsl(var(--background))',
                  titleColor: 'hsl(var(--foreground))',
                  bodyColor: 'hsl(var(--foreground))',
                  borderColor: 'hsl(var(--border))',
                  borderWidth: 1,
                  padding: 12,
                  bodyFont: {
                    family: 'var(--font-sans)',
                  },
                  titleFont: {
                    family: 'var(--font-sans)',
                  },
                  callbacks: {
                    label: (context) => {
                      const value = context.raw as number
                      return `${context.dataset.label}: ${value.toLocaleString()} users`
                    },
                  },
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default BarChartMultiple;
