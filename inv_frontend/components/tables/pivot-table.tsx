"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, RotateCcw, Download, Filter } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"

type PivotTableProps = {
  data: any[]
  title: string
  initialRows: string
  initialColumns: string
  initialValues: string
  fields: { [key: string]: string }
  onClose?: () => void
}

export default function PivotTable({
  data,
  title,
  initialRows,
  initialColumns,
  initialValues,
  fields,
  onClose,
}: PivotTableProps) {
  const [rows, setRows] = useState(initialRows)
  const [columns, setColumns] = useState(initialColumns)
  const [values, setValues] = useState(initialValues)
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterValue, setFilterValue] = useState("")

  // Generate pivot data
  const pivotData = useMemo(() => {
    // Filter data if filter is applied
    let filteredData = data
    if (filterValue) {
      const lowerFilter = filterValue.toLowerCase()
      filteredData = data.filter((item) => {
        return Object.values(item).some((val) => val && val.toString().toLowerCase().includes(lowerFilter))
      })
    }

    // Get unique column values
    const uniqueColumnValues = [...new Set(filteredData.map((item) => item[columns]))]

    // Get unique row values
    const uniqueRowValues = [...new Set(filteredData.map((item) => item[rows]))]

    // Sort if needed
    if (sortField) {
      if (sortField === rows) {
        uniqueRowValues.sort((a, b) => {
          return sortDirection === "asc" ? a.localeCompare(b) : b.localeCompare(a)
        })
      } else if (sortField === columns) {
        uniqueColumnValues.sort((a, b) => {
          return sortDirection === "asc" ? a.localeCompare(b) : b.localeCompare(a)
        })
      }
    }

    // Create pivot table data
    const pivotResult = uniqueRowValues.map((rowValue) => {
      const result: any = { [rows]: rowValue }

      uniqueColumnValues.forEach((colValue) => {
        // Find all items that match current row and column
        const matchingItems = filteredData.filter((item) => item[rows] === rowValue && item[columns] === colValue)

        // Calculate the value (sum, count, etc.)
        if (matchingItems.length > 0) {
          if (values === "count") {
            result[colValue] = matchingItems.length
          } else {
            // Sum the values
            result[colValue] = matchingItems.reduce((sum, item) => sum + (Number.parseFloat(item[values]) || 0), 0)
          }
        } else {
          result[colValue] = 0
        }
      })

      // Add total for the row
      result.Total = uniqueColumnValues.reduce((sum, colValue) => sum + (result[colValue] || 0), 0)

      return result
    })

    // Add totals row
    const totalsRow: any = { [rows]: "Total" }
    uniqueColumnValues.forEach((colValue) => {
      totalsRow[colValue] = pivotResult.reduce((sum, row) => sum + (row[colValue] || 0), 0)
    })
    totalsRow.Total = uniqueColumnValues.reduce((sum, colValue) => sum + (totalsRow[colValue] || 0), 0)

    pivotResult.push(totalsRow)

    return {
      data: pivotResult,
      columns: [...uniqueColumnValues, "Total"],
    }
  }, [data, rows, columns, values, sortField, sortDirection, filterValue])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const resetPivot = () => {
    setRows(initialRows)
    setColumns(initialColumns)
    setValues(initialValues)
    setSortField("")
    setSortDirection("asc")
    setFilterValue("")
  }

  const exportCSV = () => {
    // Create CSV content
    const headers = [rows, ...pivotData.columns]
    const csvContent = [
      headers.join(","),
      ...pivotData.data.map((row) => [row[rows], ...pivotData.columns.map((col) => row[col] || 0)].join(",")),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "-")}-pivot.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>{title} Pivot Table</CardTitle>
          <div className="flex flex-wrap gap-2">
            <NeonButton variant="neon" size="sm" onClick={resetPivot}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </NeonButton>
            <NeonButton variant="neon" size="sm" onClick={exportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </NeonButton>
            {onClose && (
              <NeonButton variant="neonPurple" size="sm" onClick={onClose}>
                Close
              </NeonButton>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rows">Rows</Label>
              <Select value={rows} onValueChange={setRows}>
                <SelectTrigger id="rows" className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                  {Object.entries(fields).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="columns">Columns</Label>
              <Select value={columns} onValueChange={setColumns}>
                <SelectTrigger id="columns" className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                  {Object.entries(fields).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="values">Values</Label>
              <Select value={values} onValueChange={setValues}>
                <SelectTrigger id="values" className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                  <SelectItem value="count">Count</SelectItem>
                  {Object.entries(fields)
                    .filter(([key]) => key !== rows && key !== columns)
                    .map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter">Filter</Label>
              <div className="relative">
                <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filter"
                  placeholder="Filter data..."
                  className="pl-8 bg-background/50 border-border/50 focus:border-primary input-neon"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border/50 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort(rows)}>
                    <div className="flex items-center">
                      {fields[rows]}
                      {sortField === rows &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  {pivotData.columns.map((column) => (
                    <TableHead
                      key={column}
                      className={`text-right ${column !== "Total" ? "cursor-pointer hover:bg-muted/80" : ""}`}
                      onClick={() => column !== "Total" && handleSort(column)}
                    >
                      <div className="flex items-center justify-end">
                        {column}
                        {sortField === column &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pivotData.data.map((row, index) => (
                  <TableRow
                    key={index}
                    className={`
                      border-t border-border/50 hover:bg-muted/20 transition-colors
                      ${row[rows] === "Total" ? "font-bold bg-muted/30" : ""}
                    `}
                  >
                    <TableCell>{row[rows]}</TableCell>
                    {pivotData.columns.map((column) => (
                      <TableCell key={column} className="text-right">
                        {values === "count"
                          ? row[column]
                          : row[column]?.toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            })}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

