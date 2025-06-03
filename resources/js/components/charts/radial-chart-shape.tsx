"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PolarArea } from "react-chartjs-2"
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
)

interface ChartDataPoint {
  category: string
  value: number
}

const chartData: ChartDataPoint[] = [
  { category: "Performance", value: 85 },
  { category: "Quality", value: 75 },
  { category: "Reliability", value: 90 },
  { category: "Efficiency", value: 80 },
  { category: "Security", value: 95 },
]

export function RadialChartShape() {
  const chartDataConfig = {
    labels: chartData.map(item => item.category),
    datasets: [
      {
        data: chartData.map(item => item.value),
        backgroundColor: [
          'hsl(var(--primary) / 0.7)',
          'hsl(var(--success) / 0.7)',
          'hsl(var(--warning) / 0.7)',
          'hsl(var(--destructive) / 0.7)',
          'hsl(var(--secondary) / 0.7)',
        ],
        borderColor: [
          'hsl(var(--primary))',
          'hsl(var(--success))',
          'hsl(var(--warning))',
          'hsl(var(--destructive))',
          'hsl(var(--secondary))',
        ],
        borderWidth: 2,
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
        <CardDescription>
          Key performance indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <PolarArea
            data={chartDataConfig}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  min: 0,
                  max: 100,
                  beginAtZero: true,
                  grid: {
                    color: 'hsl(var(--border) / 0.2)',
                  },
                  ticks: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
                    backdropColor: 'transparent',
                  },
                  pointLabels: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  position: 'right' as const,
                  labels: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
                    padding: 16,
                    usePointStyle: true,
                    pointStyle: 'circle',
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
                      return `${context.label}: ${value}%`
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

export default RadialChartShape;
