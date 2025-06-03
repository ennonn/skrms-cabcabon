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
  Filler,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
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
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

export function AreaChart() {
  const chartDataConfig = {
    labels: chartData.map(item => item.month),
    datasets: [
      {
        fill: true,
        label: 'Desktop',
        data: chartData.map(item => item.desktop),
        backgroundColor: 'hsl(var(--chart-1) / 0.2)',
        borderColor: 'hsl(var(--chart-1))',
        borderWidth: 2,
        pointBackgroundColor: 'hsl(var(--chart-1))',
        pointBorderColor: 'hsl(var(--background))',
        pointHoverBackgroundColor: 'hsl(var(--background))',
        pointHoverBorderColor: 'hsl(var(--chart-1))',
        tension: 0.4,
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <Line
            data={chartDataConfig}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
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
                    callback: (value) => {
                      const label = chartData[value as number].month
                      return label.slice(0, 3)
                    },
                  },
                },
                y: {
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

export default AreaChart;
