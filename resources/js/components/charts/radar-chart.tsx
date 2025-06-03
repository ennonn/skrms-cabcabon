"use client"

import { TrendingUp } from "lucide-react"
import { Radar } from "react-chartjs-2"
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
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface ChartDataPoint {
  month: string
  desktop: number
}

const chartData: ChartDataPoint[] = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 273 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

export function RadarChart() {
  const chartDataConfig = {
    labels: chartData.map(item => item.month),
    datasets: [
      {
        label: 'Desktop',
        data: chartData.map(item => item.desktop),
        backgroundColor: 'hsl(var(--chart-1) / 0.6)',
        borderColor: 'hsl(var(--chart-1))',
        borderWidth: 2,
        pointBackgroundColor: 'hsl(var(--chart-1))',
        pointBorderColor: 'hsl(var(--background))',
        pointHoverBackgroundColor: 'hsl(var(--background))',
        pointHoverBorderColor: 'hsl(var(--chart-1))',
      }
    ]
  }

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="mx-auto aspect-square max-h-[250px]">
          <Radar
            data={chartDataConfig}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                r: {
                  beginAtZero: true,
                  grid: {
                    color: 'hsl(var(--border) / 0.2)',
                  },
                  angleLines: {
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
                },
              },
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}

export default RadarChart;
