"use client"

import { Bar } from "react-chartjs-2"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export interface BarChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  stack?: string
}

export interface BarChartProps {
  title: string
  description?: string
  data: {
    labels: string[]
    datasets: BarChartDataset[]
  }
  className?: string
  height?: number
  stacked?: boolean
  onClick?: (index: number) => void
}

export function BarChart({
  title,
  description,
  data,
  className,
  height = 300,
  stacked = false,
  onClick,
}: BarChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              plugins: {
                legend: {
                  display: data.datasets.length > 1,
                  position: "top",
                  labels: {
                    color: "hsl(var(--foreground))",
                    font: {
                      family: "var(--font-sans)",
                    },
                  },
                },
                tooltip: {
                  backgroundColor: 'white',
                  titleColor: 'rgb(15, 23, 42)',
                  bodyColor: 'rgb(15, 23, 42)',
                  borderColor: 'rgb(226, 232, 240)',
                  borderWidth: 1,
                  padding: {
                    x: 12,
                    y: 8
                  },
                  bodyFont: {
                    family: 'var(--font-sans)',
                    size: 12
                  },
                  titleFont: {
                    family: 'var(--font-sans)',
                    size: 12,
                    weight: 'bold'
                  },
                  callbacks: {
                    title: (context) => {
                      return context[0].label;
                    },
                    label: (context) => {
                      const value = context.raw as number;
                      return value === 1 ? `${value} proposal` : `${value} proposals`;
                    }
                  },
                  displayColors: false,
                  position: 'nearest',
                  caretSize: 5,
                  cornerRadius: 4
                },
              },
              scales: {
                x: {
                  stacked,
                  grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.075)',
                    drawOnChartArea: true,
                    lineWidth: 1
                  },
                  border: {
                    display: false
                  },
                  ticks: {
                    color: "hsl(var(--muted-foreground))",
                    font: {
                      family: "var(--font-sans)",
                      size: 12
                    },
                    maxRotation: 45,
                    minRotation: 45
                  },
                },
                y: {
                  stacked,
                  beginAtZero: true,
                  grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.075)',
                    drawOnChartArea: true,
                    lineWidth: 1
                  },
                  border: {
                    display: false
                  },
                  ticks: {
                    color: "hsl(var(--muted-foreground))",
                    font: {
                      family: "var(--font-sans)",
                      size: 12
                    }
                  },
                },
              },
              onClick: onClick ? (event, elements) => {
                if (elements.length > 0) {
                  onClick(elements[0].index)
                }
              } : undefined,
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default BarChart;
