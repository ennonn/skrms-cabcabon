"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ChartDataPoint {
  date: string
  value: number
}

const chartData: ChartDataPoint[] = [
  { date: "2024-01-01", value: 2400 },
  { date: "2024-01-02", value: 2210 },
  { date: "2024-01-03", value: 2290 },
  { date: "2024-01-04", value: 2300 },
  { date: "2024-01-05", value: 2150 },
  { date: "2024-01-06", value: 2160 },
  { date: "2024-01-07", value: 2100 },
  { date: "2024-01-08", value: 2200 },
  { date: "2024-01-09", value: 2250 },
  { date: "2024-01-10", value: 2300 },
  { date: "2024-01-11", value: 2350 },
  { date: "2024-01-12", value: 2400 },
  { date: "2024-01-13", value: 2450 },
  { date: "2024-01-14", value: 2350 },
  { date: "2024-01-15", value: 2500 },
]

export function LineChartInteractive() {
  const chartDataConfig = {
    labels: chartData.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Daily Value',
        data: chartData.map(item => item.value),
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'hsl(var(--primary))',
        pointBorderColor: 'hsl(var(--background))',
        pointHoverBackgroundColor: 'hsl(var(--primary))',
        pointHoverBorderColor: 'hsl(var(--background))',
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Trend</CardTitle>
          <CardDescription>
          Value fluctuation over the past 15 days
          </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <Line
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
                  },
                  grid: {
                    color: 'hsl(var(--border) / 0.2)',
                  },
                  ticks: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
                    callback: (value) => `$${value.toLocaleString()}`,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
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
                    title: (context) => {
                      const date = new Date(chartData[context[0].dataIndex].date)
                      return date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    },
                    label: (context) => {
                      const value = context.raw as number
                      return `Value: $${value.toLocaleString()}`
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

export default LineChartInteractive;
