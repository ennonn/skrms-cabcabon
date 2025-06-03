"use client"

import { TrendingUp } from "lucide-react"
import { Bar } from "react-chartjs-2"
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
  BarElement,
  Title,
  Tooltip,
  Legend,
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

interface ChartDataPoint {
  browser: string
  visitors: number
}

const chartData: ChartDataPoint[] = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
]

const chartColors = {
  Chrome: 'hsl(var(--chart-1))',
  Safari: 'hsl(var(--chart-2))',
  Firefox: 'hsl(var(--chart-3))',
  Edge: 'hsl(var(--chart-4))',
  Other: 'hsl(var(--chart-5))',
}

export function BarChartMixed() {
  const chartDataConfig = {
    labels: chartData.map(item => item.browser),
    datasets: [
      {
        data: chartData.map(item => item.visitors),
        backgroundColor: chartData.map(item => chartColors[item.browser as keyof typeof chartColors]),
        borderRadius: 4,
        maxBarThickness: 40,
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Mixed</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <Bar
            data={chartDataConfig}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y' as const,
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
                    display: false,
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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

export default BarChartMixed;
