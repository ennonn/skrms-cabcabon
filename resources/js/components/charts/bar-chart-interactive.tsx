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
  month: string
  total: number
}

const chartData: ChartDataPoint[] = [
  { month: "Jan", total: 1085 },
  { month: "Feb", total: 1324 },
  { month: "Mar", total: 1084 },
  { month: "Apr", total: 1650 },
  { month: "May", total: 1243 },
  { month: "Jun", total: 1276 },
  { month: "Jul", total: 1432 },
  { month: "Aug", total: 1523 },
  { month: "Sep", total: 1867 },
  { month: "Oct", total: 1688 },
  { month: "Nov", total: 1912 },
  { month: "Dec", total: 1638 },
]

export function BarChartInteractive() {
  const chartDataConfig = {
    labels: chartData.map(item => item.month),
    datasets: [
      {
        label: 'Total',
        data: chartData.map(item => item.total),
        backgroundColor: 'hsl(var(--primary) / 0.2)',
        borderColor: 'hsl(var(--primary))',
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: 'hsl(var(--primary) / 0.3)',
        hoverBorderColor: 'hsl(var(--primary))',
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>
          Revenue statistics for the past year
          </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <Bar
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
                  border: {
                    display: false,
                    dash: [4, 4],
                  },
                  grid: {
                    color: 'hsl(var(--border) / 0.2)',
                  },
                  ticks: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                    },
                    callback: (value) => `$${value.toLocaleString()}`,
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
                  callbacks: {
                    label: (context) => {
                      const value = context.raw as number
                      return `Revenue: $${value.toLocaleString()}`
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

export default BarChartInteractive;
