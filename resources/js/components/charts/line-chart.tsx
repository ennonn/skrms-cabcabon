"use client"

import { Line } from "react-chartjs-2"
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartEvent,
  ActiveElement,
} from 'chart.js'

// Register ChartJS components
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

export interface LineChartDataset {
  label: string
  data: number[]
  borderColor?: string
  backgroundColor?: string
  fill?: boolean
  tension?: number
  pointRadius?: number
  pointHoverRadius?: number
}

export interface LineChartProps {
  title: string
  description?: string
  data: {
    labels: string[]
    datasets: LineChartDataset[]
  }
  className?: string
  height?: number
  onClick?: (index: number) => void
}

export function LineChart({
  title,
  description,
  data,
  className,
  height = 300,
  onClick,
}: LineChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <Line
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index' as const,
                intersect: false,
              },
              plugins: {
                legend: {
                  display: data.datasets.length > 1,
                  position: "top" as const,
                  labels: {
                    color: "hsl(var(--foreground))",
                    font: {
                      family: "var(--font-sans)",
                    },
                  },
                },
                tooltip: {
                  backgroundColor: "hsl(var(--background))",
                  titleColor: "hsl(var(--foreground))",
                  bodyColor: "hsl(var(--foreground))",
                  borderColor: "hsl(var(--border))",
                  borderWidth: 1,
                  padding: 12,
                  bodyFont: {
                    family: "var(--font-sans)",
                  },
                  titleFont: {
                    family: "var(--font-sans)",
                  },
                },
              },
              scales: {
                x: {
                  grid: {
                    color: "hsl(var(--border))",
                  },
                  ticks: {
                    color: "hsl(var(--foreground))",
                    font: {
                      family: "var(--font-sans)",
                    },
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "hsl(var(--border))",
                  },
                  ticks: {
                    color: "hsl(var(--foreground))",
                    font: {
                      family: "var(--font-sans)",
                    },
                  },
                },
              },
              onClick: onClick ? (event: ChartEvent, elements: ActiveElement[]) => {
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

export default LineChart;
