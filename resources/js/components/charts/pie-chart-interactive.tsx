"use client"

import * as React from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
] as const

const chartColors = {
  january: "hsl(var(--chart-1))",
  february: "hsl(var(--chart-2))",
  march: "hsl(var(--chart-3))",
  april: "hsl(var(--chart-4))",
  may: "hsl(var(--chart-5))",
}

const desktopData = [
  { month: "january", value: 186 },
  { month: "february", value: 305 },
  { month: "march", value: 237 },
  { month: "april", value: 173 },
  { month: "may", value: 209 },
]

export function PieChartInteractive() {
  const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month)

  const activeIndex = React.useMemo(
    () => desktopData.findIndex((item) => item.month === activeMonth),
    [activeMonth]
  )

  const chartData = React.useMemo(() => ({
    labels: desktopData.map(item => item.month.charAt(0).toUpperCase() + item.month.slice(1)),
    datasets: [{
      data: desktopData.map(item => item.value),
      backgroundColor: desktopData.map(item => chartColors[item.month as keyof typeof chartColors]),
      borderColor: desktopData.map(item => chartColors[item.month as keyof typeof chartColors]),
      borderWidth: 2,
      hoverOffset: 10,
    }]
  }), [])

  const centerText = {
    id: 'centerText',
    afterDatasetsDraw(chart: any) {
      const { ctx, data } = chart
      const activeData = data.datasets[0].data[activeIndex]
      
      ctx.save()
      const x = chart.getDatasetMeta(0).data[0].x
      const y = chart.getDatasetMeta(0).data[0].y
      
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Draw value
      ctx.font = 'bold 24px var(--font-sans)'
      ctx.fillStyle = 'hsl(var(--foreground))'
      ctx.fillText(activeData.toLocaleString(), x, y - 10)
      
      // Draw label
      ctx.font = '14px var(--font-sans)'
      ctx.fillStyle = 'hsl(var(--muted-foreground))'
      ctx.fillText('Visitors', x, y + 10)
      
      ctx.restore()
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Pie Chart - Interactive</CardTitle>
          <CardDescription>January - May 2024</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select month"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {desktopData.map(({ month }) => (
              <SelectItem
                key={month}
                value={month}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-sm"
                    style={{
                      backgroundColor: chartColors[month as keyof typeof chartColors],
                    }}
                  />
                  {month.charAt(0).toUpperCase() + month.slice(1)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <div className="mx-auto aspect-square w-full max-w-[300px]">
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '60%',
              plugins: {
                legend: {
                  display: false,
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
            }}
            plugins={[centerText]}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default PieChartInteractive;
