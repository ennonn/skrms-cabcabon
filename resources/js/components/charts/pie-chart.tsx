"use client"

import { Pie } from "react-chartjs-2"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartEvent,
  ActiveElement,
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

export interface PieChartDataset {
  label: string
  data: number[]
  backgroundColor?: string[]
  borderColor?: string[]
  borderWidth?: number
  hoverOffset?: number
}

export interface PieChartProps {
  title: string
  description?: string
  data: {
    labels: string[]
    datasets: PieChartDataset[]
  }
  className?: string
  height?: number
  onClick?: (index: number) => void
}

export function PieChart({
  title,
  description,
  data,
  className,
  height = 300,
  onClick,
}: PieChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <Pie
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
                  position: "right" as const,
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

export default PieChart;