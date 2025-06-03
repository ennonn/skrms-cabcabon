"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Doughnut } from "react-chartjs-2"
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

interface PieChartDonutWithTextProps {
  title: string
  description: string
  data: {
    labels: string[]
    datasets: Array<{
      data: number[]
      backgroundColor: string[]
      borderColor?: string[]
      borderWidth?: number
      borderRadius?: number
    }>
  }
  centerText: {
    value: number
    label: string
  }
  height?: number
}

export function PieChartDonutWithText({
  title,
  description,
  data,
  centerText,
  height = 350
}: PieChartDonutWithTextProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-[200px] h-[200px]">
          <Doughnut
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              cutout: '75%',
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  enabled: true,
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
                    weight: 'normal'
                  },
                  callbacks: {
                    title: (context) => {
                      return context[0].label;
                    },
                    label: (context) => {
                      const value = context.raw as number;
                      const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0);
                      const percentage = ((value / total) * 100).toFixed(0);
                      return `${value} (${percentage}%)`;
                    }
                  },
                  displayColors: false,
                  position: 'nearest'
                },
              },
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-semibold">{centerText.value}</div>
            <div className="text-sm text-muted-foreground">{centerText.label}</div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex justify-center items-center gap-8">
            {data.labels.map((label, index) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                  />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
                <div className="text-sm font-medium">
                  {data.datasets[0].data[index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PieChartDonutWithText;
