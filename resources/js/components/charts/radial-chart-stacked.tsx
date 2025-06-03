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
  completed: number
  remaining: number
}

const chartData: ChartDataPoint[] = [
  { category: "Project A", completed: 75, remaining: 25 },
  { category: "Project B", completed: 60, remaining: 40 },
  { category: "Project C", completed: 85, remaining: 15 },
  { category: "Project D", completed: 45, remaining: 55 },
  { category: "Project E", completed: 90, remaining: 10 },
]

export function RadialChartStacked() {
  const chartDataConfig = {
    labels: chartData.map(item => item.category),
    datasets: [
      {
        label: 'Completed',
        data: chartData.map(item => item.completed),
        backgroundColor: chartData.map((_, index) => 
          `hsl(var(--primary) / ${0.6 + (index * 0.08)})`
        ),
        borderColor: 'hsl(var(--primary))',
        borderWidth: 2,
      },
      {
        label: 'Remaining',
        data: chartData.map(item => item.remaining),
        backgroundColor: chartData.map((_, index) => 
          `hsl(var(--muted) / ${0.4 + (index * 0.08)})`
        ),
        borderColor: 'hsl(var(--muted))',
        borderWidth: 2,
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
        <CardDescription>
          Completion status of active projects
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
                    callback: (value) => `${value}%`,
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
                  position: 'top' as const,
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
                      return `${context.dataset.label}: ${value}%`
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

export default RadialChartStacked;
