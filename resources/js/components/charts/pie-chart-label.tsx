"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

interface ChartDataPoint {
  category: string
  value: number
  description: string
}

const chartData: ChartDataPoint[] = [
  { 
    category: "Product Development",
    value: 125000,
    description: "New product features and improvements"
  },
  { 
    category: "Marketing",
    value: 75000,
    description: "Campaigns and brand awareness"
  },
  { 
    category: "Operations",
    value: 100000,
    description: "Infrastructure and maintenance"
  },
  { 
    category: "Research",
    value: 50000,
    description: "Market research and analysis"
  },
]

const totalValue = chartData.reduce((sum, item) => sum + item.value, 0)
const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

export function PieChartLabel() {
  const chartDataConfig = {
    labels: chartData.map(item => item.category),
    datasets: [
      {
        data: chartData.map(item => item.value),
        backgroundColor: [
          'hsl(var(--primary) / 0.8)',
          'hsl(var(--success) / 0.8)',
          'hsl(var(--warning) / 0.8)',
          'hsl(var(--destructive) / 0.8)',
        ] as const,
        borderColor: [
          'hsl(var(--primary))',
          'hsl(var(--success))',
          'hsl(var(--warning))',
          'hsl(var(--destructive))',
        ] as const,
        borderWidth: 2,
        hoverBackgroundColor: [
          'hsl(var(--primary) / 0.9)',
          'hsl(var(--success) / 0.9)',
          'hsl(var(--warning) / 0.9)',
          'hsl(var(--destructive) / 0.9)',
        ],
        hoverBorderColor: [
          'hsl(var(--primary))',
          'hsl(var(--success))',
          'hsl(var(--warning))',
          'hsl(var(--destructive))',
        ],
        offset: 8,
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annual Budget Allocation</CardTitle>
        <CardDescription>
          Distribution of budget across departments for FY 2024
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <Pie
            data={chartDataConfig}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  right: 100
                }
              },
              plugins: {
                legend: {
                  position: 'right' as const,
                  align: 'center' as const,
                  labels: {
                    color: 'hsl(var(--foreground))',
                    font: {
                      family: 'var(--font-sans)',
                      size: 12,
                      weight: 'normal',
                    },
                    padding: 16,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    generateLabels: (chart) => {
                      const datasets = chart.data.datasets
                      return chart.data.labels?.map((label, index) => {
                        const value = datasets[0].data[index] as number
                        const percentage = ((value / totalValue) * 100).toFixed(1)
                        return {
                          text: `${label}\n${percentage}% (${formatCurrency(value)})`,
                          fillStyle: (datasets[0].backgroundColor as string[])[index],
                          strokeStyle: (datasets[0].borderColor as string[])[index],
                          lineWidth: 2,
                          hidden: false,
                          index: index,
                        }
                      }) || []
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
                    weight: 'bold',
                  },
                  callbacks: {
                    title: (tooltipItems) => {
                      const index = tooltipItems[0].dataIndex
                      return chartData[index].category
                    },
                    label: (context) => {
                      const value = context.raw as number
                      const percentage = ((value / totalValue) * 100).toFixed(1)
                      const formattedValue = formatCurrency(value)
                      return [
                        `Amount: ${formattedValue}`,
                        `Percentage: ${percentage}%`,
                        `Description: ${chartData[context.dataIndex].description}`
                      ]
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Total Budget: {formatCurrency(totalValue)}
        </div>
      </CardContent>
    </Card>
  )
}

export default PieChartLabel;
