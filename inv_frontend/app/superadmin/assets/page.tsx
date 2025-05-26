"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SuperAdminLayout from "@/components/layout/superadmin-layout"
import { Button } from "@/components/ui/button"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Download, Filter, MoreHorizontal, BarChart, FileDown, Printer, FileText, Trash2, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as XLSX from "xlsx";
import ExcelJS from 'exceljs';
import { Badge } from "@/components/ui/badge"
import PivotTable from "@/components/superadmin/pivot-table"
import AdvancedFilter from "@/components/superadmin/advanced-filter"
import {
  useGetProductsQuery,
  useUpdateProductsMutation,
  useDeleteProductsByIdMutation,
} from "@/lib/store/api/superAdmin/products/productsApi"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { useGetCategoryQuery } from "@/lib/store/api/superAdmin/category/categoryApi"
import { useToaster } from "@/lib/context/use-toaster"
// import { useToaster } from "@/lib/context/app-context"

// Filter options for advanced filtering
const filterOptions = [
  {
    id: "category",
    label: "Category",
    type: "select",
    options: [
      { value: "Computers", label: "Computers" },
      { value: "Furniture", label: "Furniture" },
      { value: "Software", label: "Software" },
      { value: "Office Equipment", label: "Office Equipment" },
      { value: "Networking", label: "Networking" },
    ],
    field: "category",
  },
  {
    id: "make",
    label: "Make",
    type: "select",
    options: [
      { value: "Dell", label: "Dell" },
      { value: "HP", label: "HP" },
      { value: "Apple", label: "Apple" },
      { value: "IKEA", label: "IKEA" },
      { value: "Herman Miller", label: "Herman Miller" },
      { value: "Adobe", label: "Adobe" },
      { value: "Microsoft", label: "Microsoft" },
      { value: "Epson", label: "Epson" },
      { value: "Cisco", label: "Cisco" },
      { value: "Ubiquiti", label: "Ubiquiti" },
      { value: "APC", label: "APC" },
      { value: "Steelcase", label: "Steelcase" },
    ],
    field: "make",
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Active", label: "Active" },
      { value: "Maintenance", label: "Maintenance" },
      { value: "Retired", label: "Retired" },
    ],
    field: "status",
  },
  {
    id: "issuedTo",
    label: "Issued To",
    type: "select",
    options: [
      { value: "IT Department", label: "IT Department" },
      { value: "Admin Department", label: "Admin Department" },
      { value: "Design Team", label: "Design Team" },
      { value: "Meeting Rooms", label: "Meeting Rooms" },
      { value: "All Departments", label: "All Departments" },
    ],
    field: "issuedTo",
  },
  {
    id: "purchaseDate",
    label: "Purchase Date",
    type: "date",
    field: "purchaseDate",
  },
  {
    id: "quantity",
    label: "Quantity",
    type: "number",
    field: "Quantity",
  },
  {
    id: "rateIncludingTaxes",
    label: "Rate",
    type: "number",
    field: "rateIncludingTaxes",
  },
]

// Fields for pivot table
const pivotFields = {
  Category: "Category",
  Make: "Make",
  Model: "Model",
  Status: "Status",
  IssuedTo: "Issued To",
  VendorName: "Vendor",
  Quantity: "Quantity",
  RateIncludingTaxes: "Rate",
  PurchaseDate: "Purchase Date",
}

export default function Assets() {
  const { addNotification } = useToaster()

  const { data: products, refetch: refetchCategoryList } = useGetProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: categoryList } = useGetCategoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  // console.log("products LIST:>>>>", products?.data)

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAssets, setFilteredAssets] = useState<any>(products?.data);
  const [showPivot, setShowPivot] = useState(false)
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const [activeFilters, setActiveFilters] = useState<any[]>([])
  const tableRef = useRef<HTMLDivElement>(null)
  const allAssetsRef = useRef<any[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [updateAsset, { isLoading: isUpdating }] = useUpdateProductsMutation();
  const [deleteAsset, { isLoading: isDeleting }] = useDeleteProductsByIdMutation();
  const [categories, setCategories] = useState<any[]>(categoryList?.data);


  useEffect(() => {
    if (products?.data) {
      allAssetsRef.current = products.data;    // stable, never lost
      setFilteredAssets(products.data);        // for display
    }
    if (categoryList?.data) {
      setCategories(categoryList.data);
    }
  }, [products?.data, categoryList?.data]);


  useEffect(() => {
    applyFilters();
  }, [searchTerm, activeFilters]);



  function formatDate(dateString: any) {
    if (!dateString) {
      return "Invalid Date"; // Return an error message if the date is empty or undefined
    }

    const date = new Date(dateString);

    // Check if the date is invalid
    if (isNaN(date.getTime())) {
      return "Invalid Date"; // Return an error message if the date is invalid
    }

    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad if needed
    const year = date.getFullYear(); // Get the year

    return `${day}-${month}-${year}`;
  }


  const applyFilters = () => {
    let data = allAssetsRef.current;

    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter((item: any) =>
        Object.values(item).some((value: any) =>
          String(value ?? "").toLowerCase().includes(lowerTerm)
        )
      );
    }

    if (activeFilters.length > 0) {
      data = data.filter((asset: any) =>
        activeFilters.every(({ field, operator, value }) => {
          const fieldVal = String(asset?.[field] ?? "").toLowerCase();
          const val = String(value ?? "").toLowerCase();

          switch (operator) {
            case "contains": return fieldVal.includes(val);
            case "equals": return fieldVal === val;
            case "startsWith": return fieldVal.startsWith(val);
            case "endsWith": return fieldVal.endsWith(val);
            case "notEquals": return fieldVal !== val;
            case "greaterThan": return Number(asset[field]) > Number(value);
            case "lessThan": return Number(asset[field]) < Number(value);
            case "before": return new Date(asset[field]) < new Date(value);
            case "after": return new Date(asset[field]) > new Date(value);
            default: return true;
          }
        })
      );
    }

    setFilteredAssets(data);
  };


  const handleAdvancedFilterApply = (filters: any[]) => {
    setActiveFilters(filters)

    if (filters.length > 0) {
      addNotification({
        message: `Applied ${filters.length} filter${filters.length > 1 ? "s" : ""}`,
        type: "success",
      })
    } else {
      addNotification({
        message: "All filters cleared",
        type: "info",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "retired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const handleEditClick = (asset: any) => {
    debugger
    setAssetToEdit(asset);
    setEditForm({ ...asset, Category: asset.Category?._id || asset.Category });
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdateAsset = async () => {
    try {
      await updateAsset({ id: assetToEdit._id, updates: editForm });
      setEditDialogOpen(false);
      setAssetToEdit(null);
      refetchCategoryList();
      addNotification({
        message: "Asset updated successfully!",
        type: "success",
      })
    } catch (err) {
      // handle error
      addNotification({
        message: "Asset updated failed!",
        type: "error",
      })
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      await deleteAsset(assetId);
      refetchCategoryList();
      addNotification({
        message: "Asset deleted successfully!",
        type: "success",
      })
    }
  };

  const exportToExcel = () => {
    debugger
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Data');

    worksheet.columns = [
      // { header: 'Session Date', key: 'session', width: 20 },
      { header: 'Starting Date', key: 'SessionStartDate', width: 20 },
      { header: 'Ending Date', key: 'SessionEndDate', width: 20 },
      { header: 'Unique Identity No', key: 'UniID', width: 25 },
      { header: 'Purchase Date', key: 'PurchaseDate', width: 20 },
      { header: 'Invoice Number', key: 'InvoiceNumber', width: 20 },
      { header: 'Asset Name', key: 'AssetName', width: 25 },
      { header: 'Make', key: 'Make', width: 20 },
      { header: 'Model', key: 'Model', width: 20 },
      {
        header: 'Product Serial Number',
        key: 'SerialNumber',
        width: 25,
      },
      { header: 'Vendor Name', key: 'VendorName', width: 25 },
      { header: 'Quantity', key: 'Quantity', width: 15 },
      { header: 'Rate (Including Taxes)', key: 'RateIncludingTaxes', width: 20 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Similar Name', key: 'SimilarName', width: 20 },
      { header: 'Issued To', key: 'IssuedTo', width: 20 },
    ];
    // addAndCheckCategory(inventoryData, worksheet);


    // Add data rows
    const dataRows = filteredAssets?.map((asset: any) => ({
      SessionStartDate: formatDate(asset.SessionStartDate),
      SessionEndDate: formatDate(asset.SessionEndDate),
      UniID: asset.UniID,
      PurchaseDate: formatDate(asset.PurchaseDate),
      InvoiceNumber: asset.InvoiceNumber,
      AssetName: asset.AssetName,
      Make: asset.Make,
      Model: asset.Model,
      SerialNumber: asset.ProductSerialNumber || asset.SerialNumber,
      VendorName: asset.VendorName,
      Quantity: asset.Quantity,
      RateIncludingTaxes: asset.RateIncludingTaxes,
      category: asset.Category?.name,
      SimilarName: asset.SimilarName,
      IssuedTo: asset.IssuedTo,
    }));

    worksheet.addRows(dataRows);


    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F4CCCC' },
      };
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      row.eachCell((cell: ExcelJS.Cell) => {
        if (rowNumber !== 1) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          if (rowNumber % 2 === 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'CCFFFF' },
            };
          }
        }
      });
    });

    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'inventory_data.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  function toInputDateValue(dateString: any) {
    if (!dateString) return "";
    // If already in yyyy-mm-dd, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    // If in dd-mm-yyyy, convert to yyyy-mm-dd
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split("-");
      return `${year}-${month}-${day}`;
    }
    // Try to parse with Date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Asset Management</h1>
          <div className="mt-4 flex space-x-2 sm:mt-0">
            {/* <NeonButton
              variant="neon"
              size="sm"
              onClick={() => setShowAdvancedFilter(true)}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Filter
              {activeFilters.length > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">{activeFilters.length}</Badge>
              )}
            </NeonButton> */}

            {/* <NeonButton
              variant="neon"
              size="sm"
              onClick={() => setShowPivot(!showPivot)}
              className="flex items-center gap-1"
            >
              <BarChart className="h-4 w-4" />
              Pivot Table
            </NeonButton> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <NeonButton variant="neon" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </NeonButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card/90 backdrop-blur-md border-border/50">
                <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
                  <FileDown className="mr-2 h-4 w-4" />
                  <span>Export to Excel</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <AnimatePresence>
          {showPivot && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PivotTable
                data={filteredAssets}
                title="Assets"
                initialRows="category"
                initialColumns="issuedTo"
                initialValues="quantity"
                fields={pivotFields}
                onClose={() => setShowPivot(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Asset Inventory</CardTitle>
              <div className="mt-4 sm:mt-0 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search assets..."
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} className="px-2 py-1 flex items-center gap-1" variant="outline">
                    {filter.label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => {
                        setActiveFilters(activeFilters.filter((_, i) => i !== index))
                      }}
                    >
                      {/* <X className="h-3 w-3" /> */}
                    </Button>
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setActiveFilters([])}>
                  Clear All
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto table-scroll min-h-[200px] max-h-[600px]" ref={tableRef}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead className="hidden lg:table-cell">StartDate</TableHead>
                    <TableHead className="hidden lg:table-cell">EndDate</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden lg:table-cell">Make</TableHead>
                    <TableHead className="hidden lg:table-cell">Model</TableHead>
                    <TableHead className="hidden xl:table-cell">PurchaseDate</TableHead>
                    <TableHead className="hidden lg:table-cell">SerialNumber</TableHead>
                    <TableHead className="hidden lg:table-cell">VendorName</TableHead>
                    <TableHead className="hidden lg:table-cell">IssuedTo</TableHead>
                    <TableHead className="hidden lg:table-cell">Quantity</TableHead>
                    <TableHead className="hidden md:table-cell">Rate (₹)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No assets found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAssets?.map((asset: any, i: any) => (
                      <TableRow key={asset._id || i}>
                        <TableCell>{asset.UniID}</TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate((asset as any)?.SessionStartDate)}</TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate((asset as any)?.SessionEndDate)}</TableCell>
                        <TableCell>{asset?.AssetName}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {categories?.find(cat => cat._id === ((asset as any)?.Category?._id || (asset as any)?.Category))?.name || ''}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{(asset as any)?.Make}</TableCell>
                        <TableCell className="hidden lg:table-cell">{(asset as any)?.Model}</TableCell>
                        <TableCell className="hidden xl:table-cell">{formatDate((asset as any)?.PurchaseDate)}</TableCell>
                        <TableCell className="hidden lg:table-cell">{(asset as any)?.ProductSerialNumber}</TableCell>
                        <TableCell className="hidden lg:table-cell">{(asset as any)?.VendorName}</TableCell>
                        <TableCell className="hidden lg:table-cell">{(asset as any)?.IssuedTo}</TableCell>

                        <TableCell>{(asset as any)?.Quantity}</TableCell>
                        <TableCell className="hidden md:table-cell">{(asset as any).RateIncludingTaxes?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor((asset as any).Status)}>{(asset as any).Status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-row gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(asset)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAsset(asset._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filter Dialog */}
      <AdvancedFilter
        isOpen={showAdvancedFilter}
        onClose={() => setShowAdvancedFilter(false)}
        onApply={handleAdvancedFilterApply}
        filterOptions={filteredAssets}
        activeFilters={activeFilters}
      />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl p-8">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>Edit the asset details below and click Update to save changes.</DialogDescription>
          </DialogHeader>
          {assetToEdit && (
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={e => { e.preventDefault(); handleUpdateAsset(); }}>
              <label className="block">
                <span className="mb-1 block font-medium">Asset Name</span>
                <Input name="AssetName" value={editForm.AssetName || ''} onChange={handleEditFormChange} />
              </label>
              <label className="block">
                <span className="mb-1 block font-medium">Unique ID</span>
                <Input name="UniID" value={editForm.UniID || ''} onChange={handleEditFormChange} />
              </label>
              <label className="block">
                <span className="mb-1 block font-medium">Start Date</span>
                <div
                  className="space-y-2 cursor-pointer"
                  onClick={() => {
                    const element = document.getElementById("SessionStartDate") as HTMLInputElement;
                    if (element) {
                      try {
                        element.showPicker();
                      } catch {
                        element.focus(); // Fallback for older browsers
                      }
                    }
                  }}
                >
                <Input 
                name="SessionStartDate" 
                id="SessionStartDate" 
                type="date" 
                value={toInputDateValue(editForm.SessionStartDate)} 
                onChange={handleEditFormChange}
                className="w-full cursor-pointer text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-2"
                
                />
                </div>
              </label>
              <label className="block">
                <span className="mb-1 block font-medium">End Date</span>
                <div
                  className="space-y-2 cursor-pointer"
                  onClick={() => {
                    const element = document.getElementById("SessionEndDate") as HTMLInputElement;
                    if (element) {
                      try {
                        element.showPicker();
                      } catch {
                        element.focus(); // Fallback for older browsers
                      }
                    }
                  }}
                >
                <Input
                 name="SessionEndDate" 
                 id="SessionEndDate"
                  type="date"
                   value={toInputDateValue(editForm.SessionEndDate)} 
                   onChange={handleEditFormChange}
                   className="w-full cursor-pointer text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-2"
                   
                   />
                </div>
              </label>
              <label className="block">
                <span className="mb-1 block font-medium text-gray-800 dark:text-gray-200">
                  Purchase Date
                </span>

                <div
                  className="space-y-2 cursor-pointer"
                  onClick={() => {
                    const element = document.getElementById("PurchaseDate") as HTMLInputElement;
                    if (element) {
                      try {
                        element.showPicker();
                      } catch {
                        element.focus(); // Fallback for older browsers
                      }
                    }
                  }}
                >
                  <Input
                    id="PurchaseDate"
                    name="PurchaseDate"
                    type="date"
                    value={toInputDateValue(editForm.PurchaseDate)}
                    onChange={handleEditFormChange}
                    className="w-full cursor-pointer text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-2"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block font-medium">Invoice Number</span>
                <Input name="InvoiceNumber" value={editForm.InvoiceNumber || ''} onChange={handleEditFormChange} />
              </label>
              <label className="block">
                <span className="mb-1 block font-medium">Make</span>
                <Input name="Make" value={editForm.Make || ''} onChange={handleEditFormChange} />
              </label>
              <label className="block">
                <span className="mb-1 block font-medium">Model</span>
                <Input name="Model" value={editForm.Model || ''} onChange={handleEditFormChange} />
              </label>
              <label className="block">
                <span className="mb-1 block font-medium">Serial Number</span>
                <Input name="ProductSerialNumber" value={editForm.ProductSerialNumber || ''} onChange={handleEditFormChange} />
              </label>
              <label className="block">
                <span className="mb-1 block font-medium">Vendor Name</span>
                <Input name="VendorName" value={editForm.VendorName || ''} onChange={handleEditFormChange} />
              </label>
              <label className="block">
                <span className="mb-1 block font-medium">Quantity</span>
                <Input name="Quantity" type="number" value={editForm.Quantity || ''} onChange={handleEditFormChange} />
              </label>
              <label className="block">
                <span className="mb-1 block font-medium">Rate (Including Taxes)</span>
                <Input name="RateIncludingTaxes" type="number" value={editForm.RateIncludingTaxes || ''} onChange={handleEditFormChange} />
              </label>
              <label className="block">
                <span className="mb-1 block font-medium text-gray-800 dark:text-gray-200">
                  Category
                </span>
                <select
                  name="Category"
                  value={editForm.Category || ''}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 
               rounded px-2 py-2 
               bg-white dark:bg-gray-800 
               text-gray-900 dark:text-gray-100 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block font-medium">Similar Name</span>
                <Input name="SimilarName" value={editForm.SimilarName || ''} onChange={handleEditFormChange} />
              </label>
              <label className="block">
                <span className="mb-1 block font-medium">Issued To</span>
                <Input name="IssuedTo" value={editForm.IssuedTo || ''} onChange={handleEditFormChange} />
              </label>
              <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isUpdating}>{isUpdating ? 'Updating...' : 'Update'}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  )
}

