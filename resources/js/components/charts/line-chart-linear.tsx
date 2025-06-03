"use client"

import { TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface LineChartLinearProps {
  title: string
  description: string
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      borderWidth: number
      pointRadius: number
      pointHoverRadius: number
      tension: number
    }>
  }
  height?: number
  trendText?: string
  footerText?: string
}

export function LineChartLinear({
  title,
  description,
  data,
  height = 350,
  trendText,
  footerText
}: LineChartLinearProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <Line
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                intersect: false,
                mode: 'index'
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
                    color: 'hsl(var(--muted-foreground))',
                    font: {
                      family: 'var(--font-sans)',
                      size: 12
                    }
                  },
                },
                y: {
                  border: {
                    display: false,
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.075)',
                    drawOnChartArea: true,
                    lineWidth: 1
                  },
                  ticks: {
                    color: 'hsl(var(--muted-foreground))',
                    font: {
                      family: 'var(--font-sans)',
                      size: 12
                    }
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
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
            }}
          />
        </div>
      </CardContent>
      {(trendText || footerText) && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {trendText && (
            <div className="flex gap-2 font-medium leading-none">
              {trendText} <TrendingUp className="h-4 w-4" />
            </div>
          )}
          {footerText && (
            <div className="leading-none text-muted-foreground">
              {footerText}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export default LineChartLinear;
