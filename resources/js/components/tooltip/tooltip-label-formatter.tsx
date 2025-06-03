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
  date: string
  running: number
  swimming: number
}

const chartData: ChartDataPoint[] = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  { date: "2024-07-17", running: 520, swimming: 120 },
  { date: "2024-07-18", running: 140, swimming: 550 },
  { date: "2024-07-19", running: 600, swimming: 350 },
  { date: "2024-07-20", running: 480, swimming: 400 },
]

export function TooltipLabelFormatter() {
  const chartDataConfig = {
    labels: chartData.map(item => {
      return new Date(item.date).toLocaleDateString("en-US", {
        weekday: "short",
      })
    }),
    datasets: [
      {
        label: 'Running',
        data: chartData.map(item => item.running),
        backgroundColor: 'hsl(var(--chart-1))',
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 4,
          bottomRight: 4,
        },
      },
      {
        label: 'Swimming',
        data: chartData.map(item => item.swimming),
        backgroundColor: 'hsl(var(--chart-2))',
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 0,
          bottomRight: 0,
        },
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tooltip - Label Formatter</CardTitle>
        <CardDescription>Tooltip with label formatter.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <Bar
            data={chartDataConfig}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                intersect: false,
                mode: 'index' as const,
              },
              scales: {
                x: {
                  stacked: true,
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
                  stacked: true,
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
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top' as const,
                  labels: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
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
                    title: (context) => {
                      const date = chartData[context[0].dataIndex].date;
                      return new Date(date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                    },
                    label: (context) => {
                      const value = context.raw as number;
                      return `${context.dataset.label}: ${value.toLocaleString()} minutes`;
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

export default TooltipLabelFormatter;
