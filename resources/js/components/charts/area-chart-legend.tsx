"use client"

import { TrendingUp } from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

interface ChartDataPoint {
  month: string
  desktop: number
  mobile: number
}

const chartData: ChartDataPoint[] = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

export function AreaChartLegend() {
  const chartDataConfig = {
    labels: chartData.map(item => item.month.slice(0, 3)),
    datasets: [
      {
        label: 'Desktop',
        data: chartData.map(item => item.desktop),
        borderColor: 'hsl(var(--chart-1))',
        backgroundColor: 'hsl(var(--chart-1) / 0.4)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Mobile',
        data: chartData.map(item => item.mobile),
        borderColor: 'hsl(var(--chart-2))',
        backgroundColor: 'hsl(var(--chart-2) / 0.4)',
        fill: true,
        tension: 0.4,
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Legend</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
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
                    color: 'hsl(var(--border) / 0.2)',
                  },
                  ticks: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
                  },
                },
                y: {
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
                  position: 'top' as const,
                  labels: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
                    padding: 16,
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
                },
              },
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default AreaChartLegend;
