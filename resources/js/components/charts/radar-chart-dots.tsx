"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface ChartDataPoint {
  skill: string
  current: number
  target: number
}

const chartData: ChartDataPoint[] = [
  { skill: "Technical", current: 80, target: 90 },
  { skill: "Communication", current: 75, target: 85 },
  { skill: "Leadership", current: 70, target: 80 },
  { skill: "Problem Solving", current: 85, target: 95 },
  { skill: "Teamwork", current: 90, target: 95 },
  { skill: "Innovation", current: 65, target: 85 },
]

export function RadarChartDots() {
  const chartDataConfig = {
    labels: chartData.map(item => item.skill),
    datasets: [
      {
        label: 'Current Level',
        data: chartData.map(item => item.current),
        backgroundColor: 'hsl(var(--primary) / 0.2)',
        borderColor: 'hsl(var(--primary))',
        borderWidth: 2,
        pointBackgroundColor: 'hsl(var(--primary))',
        pointBorderColor: 'hsl(var(--background))',
        pointHoverBackgroundColor: 'hsl(var(--primary))',
        pointHoverBorderColor: 'hsl(var(--background))',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Target Level',
        data: chartData.map(item => item.target),
        backgroundColor: 'hsl(var(--destructive) / 0.2)',
        borderColor: 'hsl(var(--destructive))',
        borderWidth: 2,
        pointBackgroundColor: 'hsl(var(--destructive))',
        pointBorderColor: 'hsl(var(--background))',
        pointHoverBackgroundColor: 'hsl(var(--destructive))',
        pointHoverBorderColor: 'hsl(var(--background))',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Assessment</CardTitle>
        <CardDescription>
          Current vs target skill levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <Radar
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
                  pointLabels: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
                  },
                  ticks: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
                    backdropColor: 'transparent',
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

export default RadarChartDots;
