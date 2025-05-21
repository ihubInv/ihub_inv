"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { NeonButton } from "@/components/ui/neon-button"
import { ChevronDown, ChevronUp, RotateCcw, Download, Filter, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useGetCategoryQuery } from "@/lib/store/api/superAdmin/category/categoryApi"

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
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [availableFilterValues, setAvailableFilterValues] = useState<Record<string, string[]>>({})
  const { data: categoryList } = useGetCategoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  // const cat: any = categoryList?.data?.find(cat => cat._id === ((data as any)?.Category?._id || (data as any)?.Category))?.name || ''
  // console.log("cat:>>>>", cat)
  // Extract unique values for each field for filtering
  useEffect(() => {
    const filterValues: Record<string, string[]> = {}
    const cat: any = categoryList?.data?.find(cat => cat._id === ((data as any)?.Category?._id || (data as any)?.Category))?.name || ''
    console.log("cat:>>>>", cat)
    Object.keys(fields).forEach((field) => {
      const uniqueValues = [...new Set(data.map((item) => String(item[field])))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))

      filterValues[field] = uniqueValues
    })

    setAvailableFilterValues(filterValues)
  }, [data, fields])

  // Generate pivot data
  const pivotData = useMemo(() => {
    // Filter data based on active filters and search term
    let filteredData = data

    // Apply active filters
    if (Object.keys(activeFilters).length > 0) {
      filteredData = filteredData.filter((item) => {
        return Object.entries(activeFilters).every(([field, values]) => {
          if (values.length === 0) return true
          return values.includes(String(item[field]))
        })
      })
    }

    // Apply search filter
    if (filterValue) {
      const lowerFilter = filterValue.toLowerCase()
      filteredData = filteredData.filter((item) => {
        return Object.values(item).some((val) => val && String(val).toLowerCase().includes(lowerFilter))
      })
    }

    // Get unique column values
    const uniqueColumnValues = [...new Set(filteredData.map((item) => item[columns]))]
      .filter(Boolean)
      .sort((a, b) => String(a).localeCompare(String(b)))

    // Get unique row values
    const uniqueRowValues = [...new Set(filteredData.map((item) => item[rows]))]
      .filter(Boolean)
      .sort((a, b) => String(a).localeCompare(String(b)))

    // Sort if needed
    if (sortField) {
      if (sortField === rows) {
        uniqueRowValues.sort((a, b) => {
          return sortDirection === "asc" ? String(a).localeCompare(String(b)) : String(b).localeCompare(String(a))
        })
      } else if (sortField === columns) {
        uniqueColumnValues.sort((a, b) => {
          return sortDirection === "asc" ? String(a).localeCompare(String(b)) : String(b).localeCompare(String(a))
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
            result[colValue] = matchingItems.reduce((sum, item) => sum + (Number(item[values]) || 0), 0)
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
      filteredCount: filteredData.length,
      totalCount: data.length,
    }
  }, [data, rows, columns, values, sortField, sortDirection, filterValue, activeFilters])

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
    setActiveFilters({})
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

  const toggleFilter = (field: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[field] || []
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]

      return {
        ...prev,
        [field]: updated,
      }
    })
  }

  const clearFieldFilter = (field: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [field]: [],
    }))
  }

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, values) => count + values.length, 0)
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
          <div>
            <CardTitle>{title} Pivot Table </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {pivotData.filteredCount} of {pivotData.totalCount} records
            </p>
          </div>
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
                <X className="mr-2 h-4 w-4" />
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
                    .filter(([key]) => {
                      // Only include numeric fields for aggregation
                      if (key === rows || key === columns) return false
                      // Check if the field contains numeric values
                      return data.some((item) => typeof item[key] === "number")
                    })
                    .map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        Sum of {label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="filter">Search</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      Filters
                      {getActiveFilterCount() > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                          {getActiveFilterCount()}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 max-h-96 overflow-y-auto p-0" align="end">
                    <div className="p-4 border-b border-border/50">
                      <h4 className="font-medium">Filter Data</h4>
                      <p className="text-sm text-muted-foreground">Select values to include in the pivot table</p>
                    </div>
                    <div className="p-4 space-y-4">
                      {Object.entries(fields).map(([field, label]) => (
                        <div key={field} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">{label}</Label>
                            {(activeFilters[field]?.length || 0) > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => clearFieldFilter(field)}
                              >
                                Clear
                              </Button>
                            )}
                          </div>
                          <div className="space-y-1 max-h-32 overflow-y-auto pl-1">
                            {availableFilterValues[field]?.length > 0 ? (
                              availableFilterValues[field].map((value) => (
                                <div key={`${field}-${value}`} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${field}-${value}`}
                                    checked={(activeFilters[field] || []).includes(value)}
                                    onCheckedChange={() => toggleFilter(field, value)}
                                  />
                                  <label
                                    htmlFor={`${field}-${value}`}
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {value}
                                  </label>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No values available</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="relative">
                <Input
                  id="filter"
                  placeholder="Search data..."
                  className="pl-8 bg-background/50 border-border/50 focus:border-primary input-neon"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
                <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                {filterValue && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9"
                    onClick={() => setFilterValue("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
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
                {pivotData.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={pivotData.columns.length + 1} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pivotData.data.map((row, index) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

