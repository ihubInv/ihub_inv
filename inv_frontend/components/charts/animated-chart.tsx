"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, registerables } from "chart.js"
import { useTheme } from "@/lib/theme-config"

Chart.register(...registerables)

interface AnimatedChartProps {
  title: string
  type: "bar" | "line" | "pie" | "doughnut"
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
      fill?: boolean
      tension?: number
    }[]
  }
  height?: number
}

export default function AnimatedChart({ title, type, data, height = 300 }: AnimatedChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const { theme } = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Set chart colors based on theme
    const textColor = theme === "dark" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
    const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          easing: "easeOutQuart",
        },
        plugins: {
          legend: {
            labels: {
              color: textColor,
              font: {
                family: "Inter, sans-serif",
              },
            },
          },
          tooltip: {
            backgroundColor: theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
            titleColor: theme === "dark" ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
            bodyColor: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
            borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 6,
            boxPadding: 4,
          },
        },
        scales:
          type !== "pie" && type !== "doughnut"
            ? {
                x: {
                  grid: {
                    color: gridColor,
                  },
                  ticks: {
                    color: textColor,
                    font: {
                      family: "Inter, sans-serif",
                    },
                  },
                },
                y: {
                  grid: {
                    color: gridColor,
                  },
                  ticks: {
                    color: textColor,
                    font: {
                      family: "Inter, sans-serif",
                    },
                  },
                },
              }
            : undefined,
      },
    })

    // Set visible after a short delay for animation
    setTimeout(() => {
      setIsVisible(true)
    }, 100)

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, type, theme])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="chart-container"
    >
      <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: `${height}px` }}>
            <canvas ref={chartRef} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

