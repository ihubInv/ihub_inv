"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useGetCategoryQuery } from "@/lib/store/api/superAdmin/category/categoryApi"

type FilterOption = {
  id: string
  label: string
  type: "text" | "select" | "date" | "number" | "boolean"
  options?: { value: string; label: string }[]
  field: string
}

type FilterValue = {
  field: string
  operator: string
  value: any
  label: string
}

type AdvancedFilterProps = {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterValue[]) => void
  filterOptions: FilterOption[]
  activeFilters: FilterValue[]
}

export default function AdvancedFilter({
  isOpen,
  onClose,
  onApply,
  filterOptions,
  activeFilters,
}: AdvancedFilterProps) {
  const [filters, setFilters] = useState<FilterValue[]>(activeFilters || [])
  const [currentFilter, setCurrentFilter] = useState<FilterOption | null>(null)
  const [currentOperator, setCurrentOperator] = useState<string>("")
  const [currentValue, setCurrentValue] = useState<any>("")
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined)
  const [numberRange, setNumberRange] = useState<[number, number]>([0, 100])

  // Reset current filter state when dialog opens
  useEffect(() => {
    debugger
    if (isOpen) {
      setFilters(activeFilters || [])
      setCurrentFilter(null)
      setCurrentOperator("")
      setCurrentValue("")
      setDateValue(undefined)
    }
   
  }, [isOpen, activeFilters])


  const getOperatorOptions = (type: string) => {
    switch (type) {
      case "text":
        return [
          { value: "contains", label: "Contains" },
          { value: "equals", label: "Equals" },
          { value: "startsWith", label: "Starts with" },
          { value: "endsWith", label: "Ends with" },
        ]
      case "select":
        return [
          { value: "equals", label: "Equals" },
          { value: "notEquals", label: "Not equals" },
        ]
      case "date":
        return [
          { value: "equals", label: "Equals" },
          { value: "before", label: "Before" },
          { value: "after", label: "After" },
          { value: "between", label: "Between" },
        ]
      case "number":
        return [
          { value: "equals", label: "Equals" },
          { value: "greaterThan", label: "Greater than" },
          { value: "lessThan", label: "Less than" },
          { value: "between", label: "Between" },
        ]
      case "boolean":
        return [{ value: "equals", label: "Equals" }]
      default:
        return []
    }
  }

  const addFilter = () => {
    debugger
    if (!currentFilter || !currentOperator) return

    let value = currentValue

    // Handle date values
    if (currentFilter.type === "date" && dateValue) {
      value = dateValue.toISOString().split("T")[0]
    }

    // Create filter label
    const operatorLabel =
      getOperatorOptions(currentFilter.type).find((op) => op.value === currentOperator)?.label || currentOperator

    let valueLabel = value
    if (currentFilter.type === "select" && currentFilter.options) {
      valueLabel = currentFilter.options.find((opt) => opt.value === value)?.label || value
    }

    const newFilter: FilterValue = {
      field: currentFilter.field,
      operator: currentOperator,
      value,
      label: `${currentFilter.label} ${operatorLabel.toLowerCase()} ${valueLabel}`,
    }

    setFilters([...filters, newFilter])

    // Reset current filter state
    setCurrentFilter(null)
    setCurrentOperator("")
    setCurrentValue("")
    setDateValue(undefined)
  }

  const removeFilter = (index: number) => {
    const newFilters = [...filters]
    newFilters.splice(index, 1)
    setFilters(newFilters)
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleClearAll = () => {
    setFilters([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card/90 backdrop-blur-md border-border/50 max-w-3xl">
        <DialogHeader>
          <DialogTitle>Advanced Filter</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <div className="space-y-2">
            <Label>Field</Label>
            <Select
              value={currentFilter?._id || ""}
              onValueChange={(value) => {
                const filter = filterOptions?.find((f) => f._id === value) || null
                setCurrentFilter(filter)
                setCurrentOperator("")
                setCurrentValue("")
              }}
            >
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                {filterOptions?.map((option) => {
                  console.log("option:>>>>", option)
                  return (
                    <SelectItem key={option._id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>

            </Select>
          </div>

          {currentFilter && (
            <div className="space-y-2">
              <Label>Operator</Label>
              <Select value={currentOperator} onValueChange={setCurrentOperator}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                  {getOperatorOptions(currentFilter.type).map((option, i) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {currentFilter && currentOperator && (
            <div className="space-y-2">
              <Label>Value</Label>
              {currentFilter.type === "text" && (
                <Input
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary input-neon"
                  placeholder="Enter text value"
                />
              )}

              {currentFilter.type === "select" && (
                <Select value={currentValue} onValueChange={setCurrentValue}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                    {currentFilter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {currentFilter.type === "date" && (
                <DatePicker date={dateValue} setDate={setDateValue} className="bg-background/50 border-border/50" />
              )}

              {currentFilter.type === "number" && (
                <Input
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary input-neon"
                  placeholder="Enter number value"
                />
              )}

              {currentFilter.type === "boolean" && (
                <Select value={currentValue} onValueChange={setCurrentValue}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>

        {currentFilter && currentOperator && (
          <div className="flex justify-end mb-4">
            <Button onClick={addFilter}>Add Filter</Button>
          </div>
        )}

        <div className="border rounded-md p-4 min-h-[100px] bg-background/50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Active Filters</h4>
            {filters.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearAll} className="h-7 px-2 text-xs">
                Clear All
              </Button>
            )}
          </div>

          {filters.length === 0 ? (
            <p className="text-sm text-muted-foreground">No filters applied</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <Badge key={index} className="px-2 py-1 flex items-center gap-1">
                  {filter.label}
                  <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => removeFilter(index)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <NeonButton variant="neon" onClick={handleApply}>
            Apply Filters
          </NeonButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

