"use client"

import type React from "react"

import { useEffect, useState } from "react"
import SuperAdminLayout from "@/components/layout/superadmin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileUp, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBulkUploadProductsMutation, useCreateProductsMutation, useGetProductsQuery } from "@/lib/store/api/superAdmin/products/productsApi"
import { useGetCategoryQuery } from "@/lib/store/api/superAdmin/category/categoryApi"
// import { useToaster } from "@/lib/context/app-context"
import * as XLSX from "xlsx";
import { useToaster } from "@/lib/context/use-toaster"
// Mock categories
// const categories = [
//   { id: "1", name: "Computers", type: "Tangible" },
//   { id: "2", name: "Furniture", type: "Tangible" },
//   { id: "3", name: "Software", type: "Intangible" },
//   { id: "4", name: "Office Equipment", type: "Tangible" },
// ]

export default function AddAsset() {
  const { data: categoryList, refetch: refetchCategoryList } = useGetCategoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  // console.log("CATEGORY LIST:>>>>", categoryList?.data)
  const { addNotification } = useToaster()
  const [bulkUploadProducts, { isLoading: isBulkUploading }] = useBulkUploadProductsMutation();
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    UniID: "",
    PurchaseDate: "",
    InvoiceNumber: "",
    AssetName: "",
    // Make: "",
    Model: "",
    ProductSerialNumber: "",
    SerialNumber: "",
    VendorName: "",
    Quantity: "",
    RateIncludingTaxes: "",
    // SimilarName: "",
    Category: "",
    IssuedTo: "",
    SessionStartDate: "",
    SessionEndDate: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [fileData, setFileData] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)
  const [createProduct, { isLoading, isSuccess }] = useCreateProductsMutation();

  const { refetch } = useGetProductsQuery();


  useEffect(() => {
    if (categoryList?.data) {
      setCategories(categoryList.data);
    }
  }, [categoryList]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    debugger
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(false)
    setError("")

    try {
      // Map formData to API payload structure
      const payload: any = {
        UniID: formData.UniID,
        PurchaseDate: formData.PurchaseDate ? new Date(formData.PurchaseDate) : undefined,
        InvoiceNumber: formData.InvoiceNumber,
        AssetName: formData.AssetName,
        Model: formData.Model,
        // Make: formData.Make,
        ProductSerialNumber: formData.SerialNumber,
        VendorName: formData.VendorName,
        Quantity: Number(formData.Quantity),
        RateIncludingTaxes: Number(formData.RateIncludingTaxes),
        // SimilarName: formData.SimilarName,
        Category: formData.Category,
        IssuedTo: formData.IssuedTo,
        SessionStartDate: formData.SessionStartDate ? new Date(formData.SessionStartDate) : undefined,
        SessionEndDate: formData.SessionEndDate ? new Date(formData.SessionEndDate) : undefined,
      }
      await createProduct(payload).unwrap()
      setFormData({
        UniID: "",
        PurchaseDate: "",
        InvoiceNumber: "",
        AssetName: "",
        // Make: "",
        Model: "",
        ProductSerialNumber: "",
        SerialNumber: "",
        VendorName: "",
        Quantity: "",
        RateIncludingTaxes: "",
        // SimilarName: "",
        Category: "",
        IssuedTo: "",
        SessionStartDate: "",
        SessionEndDate: "",
      })
      addNotification({
        message: "Asset added successfully!",
        type: "success",
      })
      setSuccess(true)
      refetch()
    } catch (err) {
      setError("Failed to add asset. Please try again.")
      addNotification({
        message: "Asset added failed!",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = e.target.files?.[0]
  //   if (selectedFile) {
  //     setFile(selectedFile)
  //     // In a real app, you would parse the Excel file here
  //     // For demo purposes, we'll simulate parsing after a delay
  //     setIsProcessing(true)
  //     setTimeout(() => {
  //       // Mock data that would come from the Excel file
  //       const mockExcelData:any = [
  //         {
  //           UniID: "A123",
  //           PurchaseDate: "2023-06-15",
  //           InvoiceNumber: "INV-001",
  //           AssetName: "Dell Laptop",
  //           Make: "Dell",
  //           model: "Latitude 5420",
  //           serialNumber: "DL5420-001",
  //           vendorName: "Dell Technologies",
  //           quantity: "5",
  //           rate: "85000",
  //           category: "1", // Computers
  //         },
  //         {
  //           UniID: "A124",
  //           PurchaseDate: "2023-06-15",
  //           InvoiceNumber: "INV-002",
  //           AssetName: "HP Monitor",
  //           Make: "HP",
  //           Model: "24f",
  //           SerialNumber: "HP24F-002",
  //           VendorName: "HP Inc.",
  //           Quantity: "10",
  //           RateIncludingTaxes: "15000",
  //           Category: "4", // Office Equipment
  //         },
  //         {
  //           UniID: "A125",
  //           PurchaseDate: "2023-06-15",
  //           InvoiceNumber: "INV-003",
  //           AssetName: "Office Chair",
  //           Make: "Herman Miller",
  //           Model: "Aeron",
  //           SerialNumber: "HM-ARN-003",
  //           VendorName: "Herman Miller",
  //           Quantity: "15",
  //           RateIncludingTaxes: "35000",
  //           Category: "2", // Furniture
  //         },
  //       ]

  //       setFileData(mockExcelData)
  //       setIsProcessing(false)
  //     }, 2000)
  //   }
  // }

  // function reverseFormatDate(dateString: string): string {
  //   if (!dateString) {
  //     return "Invalid Date";
  //   }

  //   const [day, month, year] = dateString.split('-');
  //   if (!day || !month || !year) {
  //     return "Invalid Date";
  //   }

  //   const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

  //   // Validate the created date
  //   if (isNaN(isoDate.getTime())) {
  //     return "Invalid Date";
  //   }

  //   return isoDate.toISOString(); // returns in ISO format e.g. 2025-05-31T00:00:00.000Z
  // }




  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   debugger
  //   const selectedFile = e.target.files?.[0];
  //   if (!selectedFile) return;

  //   setFile(selectedFile);
  //   setIsProcessing(true);

  //   const reader = new FileReader();

  //   reader.onload = async (event) => {
  //     try {
  //       const data = new Uint8Array(event.target?.result as ArrayBuffer);
  //       const workbook = XLSX.read(data, { type: 'array' });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];

  //       const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  //       const formattedData:any = (jsonData as any[]).map((row) => ({
  //         UniID: row['Unique Identity No'] || row.UniID,
  //         PurchaseDate: row['Purchase Date'] || '',
  //         InvoiceNumber: row['Invoice Number'] || '',
  //         AssetName: row['Asset Name'] || '',
  //         Make: row['Make'] || '',
  //         Model: row['Model'] || '',
  //         SerialNumber: row['Product Serial Number'] || '',
  //         VendorName: row['Vendor Name'] || '',
  //         Quantity: row['Quantity'] || '',
  //         RateIncludingTaxes: row['Rate (Including Taxes)'] || '',
  //         Category: row['Category'] || '',
  //         IssuedTo: row['Issued To'] || '',
  //       }));

  //       setFileData(formattedData);

  //       // 🔥 Bulk upload using RTK mutation
  //       await bulkUploadProducts(formattedData).unwrap();

  //       alert('All assets uploaded successfully.');
  //     } catch (err) {
  //       console.error('Upload failed:', err);
  //       alert('Failed to upload some or all assets.');
  //     } finally {
  //       setIsProcessing(false);
  //     }
  //   };

  //   reader.readAsArrayBuffer(selectedFile);
  // };


  const reverseFormatDate = (dateString: string): string => {
    debugger
    const [day, month, year] = dateString.split('-');
    if (!day || !month || !year) return '';
    const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    return isNaN(isoDate.getTime()) ? '' : isoDate.toISOString();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsProcessing(true);
    setFile(selectedFile);

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const formattedData: any = (jsonData as any[]).map((row) => ({
          SessionStartDate: reverseFormatDate(row['Starting Date']),
          SessionEndDate: reverseFormatDate(row['Ending Date']),
          UniID: row['Unique Identity No'],
          PurchaseDate: reverseFormatDate(row['Purchase Date']),
          InvoiceNumber: row['Invoice Number'],
          AssetName: row['Asset Name'],
          // Make: row['Make'],
          Model: row['Model'],
          ProductSerialNumber: row['Product Serial Number'] || row['SerialNumber'],
          VendorName: row['Vendor Name'],
          Quantity: Number(row['Quantity']),
          RateIncludingTaxes: Number(row['Rate (Including Taxes)']),
          Category: row['Category'],
          // SimilarName: row['Similar Name'],
          IssuedTo: row['Issued To'],
        }));

        setFileData(formattedData);

        // 🔥 Send to backend
        await bulkUploadProducts(formattedData).unwrap();
        addNotification({
          message: "Excel data uploaded successfully!",
          type: "success",
        })
        // console.log("bulk upload DATA:>>>>", formattedData)
        // alert('Excel data uploaded successfully!');
      } catch (err) {
        addNotification({
          message: "Excel data upload failed!",
          type: "error",
        })
        // console.error('Upload error:', err);
        // alert('Failed to upload Excel data.');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };








  // const handleBulkImport = async () => {
  //   if (fileData.length === 0) return

  //   setIsSubmitting(true)
  //   setImportSuccess(false)
  //   setError("")

  //   try {
  //     // Map each item to the API payload structure and call createProduct for each
  //     await Promise.all(
  //       fileData?.map(async (item) => {
  //         const payload:any = {
  //           UniID: item.UniID,
  //           PurchaseDate: item.PurchaseDate ? new Date(item.PurchaseDate) : undefined,
  //           InvoiceNumber: item.InvoiceNumber,
  //           AssetName: item.AssetName,
  //           MakeModel: item.Make + (item.Model ? ` ${item.Model}` : ""),
  //           ProductSerialNumber: item.SerialNumber,
  //           VendorName: item.VendorName,
  //           Quantity: Number(item.Quantity),
  //           RateIncludingTaxes: Number(item.RateIncludingTaxes),
  //           SimilarName: item.SimilarName,
  //           SerialNumber: item.SerialNumber,
  //           Category: item.Category,
  //           IssuedTo: item.IssuedTo,
  //           SessionStartDate: item.SessionStartDate ? new Date(item.SessionStartDate) : undefined,
  //           SessionEndDate: item.SessionEndDate ? new Date(item.SessionEndDate) : undefined,
  //         }
  //         await createProduct(payload).unwrap()
  //       })
  //     )
  //     console.log("FILE DATA:>>>>", fileData)
  //     setImportSuccess(true)
  //     setFile(null)
  //     setFileData([])
  //     refetch()
  //   } catch (err) {
  //     setError("Failed to import assets. Please try again.")
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }







  // const handleFileUpload = async (event:any) => {

  //   const file = event.target.files?.[0]; // Get uploaded file
  //   setSelectedFile(file);
  //     if (!file) {
  //       alert('Please upload a valid Excel file.');
  //       return;
  //     }

  //     try {
  //       const reader = new FileReader();

  //       reader.onload = async (e) => {
  //         const data = e.target?.result;
  //         const workbook = XLSX.read(data, { type: 'binary' });
  //         const sheetName = workbook.SheetNames[0];
  //         const sheet = workbook.Sheets[sheetName];
  //         let jsonData = XLSX.utils.sheet_to_json(sheet);
  //         let convertData=convertJsonToModelData(jsonData)
  //         let isCategory=addAndCheckCategory(convertData)
  //         console.log('Parsed Excel Data:', convertData);
  //         console.log('Parsed Excel Data:', isCategory);
  //           try {
  //             await createProduct(isCategory).unwrap();
  //             console.log('Product uploaded successfully:', isCategory);
  //             alert('File uploaded and processed successfully!');
  //             setFormData([{}])
  //             refetch()
  //           } catch (error) {
  //             console.error('Error uploading product:', error);
  //           }
  //       };

  //       reader.readAsBinaryString(file);
  //     } catch (error) {
  //       console.error('Error uploading file:', error);
  //       alert('An error occurred while uploading the file.');
  //     }
  //   };

  //   const handleUploadClick = () => {
  //     if (!selectedFile) {
  //       alert("Please select a file first!");
  //       return;
  //     }
  //   };



  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Add New Asset</h1>

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">Success</AlertTitle>
            <AlertDescription className="text-green-600">Asset has been added successfully.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="single">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="single">Single Asset</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>Asset Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Basic Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="uniqueId">Unique ID</Label>
                        <Input
                          id="UniID"
                          name="UniID"
                          value={formData.UniID}
                          onChange={handleChange}
                          required
                        />
                      </div>

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
                        <Label htmlFor="PurchaseDate">Purchase Date</Label>
                        <Input
                          id="PurchaseDate"
                          name="PurchaseDate"
                          type="date"
                          value={formData.PurchaseDate}
                          onChange={handleChange}
                          required
                        />
                      </div>





                      <div className="space-y-2">
                        <Label htmlFor="invoiceNumber">Invoice Number</Label>
                        <Input
                          id="InvoiceNumber"
                          name="InvoiceNumber"
                          value={formData.InvoiceNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="assetName">Asset Name</Label>
                        <Input
                          id="AssetName"
                          name="AssetName"
                          value={formData.AssetName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* <div className="space-y-2">
                        <Label htmlFor="Make">Make</Label>
                        <Input id="Make" name="Make" value={formData.Make} onChange={handleChange} required />
                      </div> */}

                      <div className="space-y-2">
                        <Label htmlFor="Model">Model</Label>
                        <Input id="Model" name="Model" value={formData.Model} onChange={handleChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serialNumber">Serial Number</Label>
                        <Input
                          id="SerialNumber"
                          name="SerialNumber"
                          value={formData.SerialNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vendorName">Vendor Name</Label>
                        <Input
                          id="VendorName"
                          name="VendorName"
                          value={formData.VendorName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="Quantity"
                          name="Quantity"
                          type="number"
                          min="1"
                          value={formData.Quantity}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rate">Rate (Including Taxes)</Label>
                        <Input
                          id="RateIncludingTaxes"
                          name="RateIncludingTaxes"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.RateIncludingTaxes}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* <div className="space-y-2">
                        <Label htmlFor="similarName">Similar Name</Label>
                        <Input
                          id="SimilarName"
                          name="SimilarName"
                          value={formData.SimilarName}
                          onChange={handleChange}
                        />
                      </div> */}

                      <div className="space-y-2">
                        <Label htmlFor="Category">Category</Label>
                        <Select
                          value={formData.Category}
                          onValueChange={(value) => handleSelectChange("Category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((category: any) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category?.name} ({category?.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Allocation Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="IssuedTo">Issued To</Label>
                        <Input id="IssuedTo" name="IssuedTo" value={formData.IssuedTo} onChange={handleChange} />
                      </div>

                      {/* <div className="space-y-2"> */}

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
                        }}>
                        <Label htmlFor="SessionStartDate">Session Start Date</Label>
                        <Input
                          id="SessionStartDate"
                          name="SessionStartDate"
                          type="date"
                          value={formData.SessionStartDate}
                          onChange={handleChange}
                        />
                      </div>

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
                        }}>
                        <Label htmlFor="SessionEndDate">Session End Date</Label>
                        <Input
                          id="SessionEndDate"
                          name="SessionEndDate"
                          type="date"
                          value={formData.SessionEndDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="mt-4" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Asset"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Import Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-lg p-12">
                      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Upload Excel File</h3>
                      <p className="text-sm text-muted-foreground mb-4 text-center">
                        Upload an Excel file (.xlsx) with asset information.
                        <br />
                        {/* <a href="#" className="text-primary hover:underline">
                          Download template
                        </a> */}
                      </p>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="bg-primary/10 text-primary border border-primary/30 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] hover:bg-primary/20 px-4 py-2 rounded-md flex items-center">
                          <FileUp className="mr-2 h-4 w-4" />
                          <span>Select File</span>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".xlsx, .xls"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={isProcessing || isSubmitting}
                        />
                      </label>
                    </div>

                    {isProcessing && (
                      <div className="flex flex-col items-center justify-center p-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">Processing file...</p>
                      </div>
                    )}

                    {/* {fileData.length > 0 && !isProcessing && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Preview ({fileData.length} assets)</h3>
                        <div className="border rounded-lg overflow-auto max-h-96">
                          <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  ID
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Make
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Model
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Quantity
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Rate
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                              {fileData.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                                  <td className="px-4 py-2 text-sm">{item.UniID}</td>
                                  <td className="px-4 py-2 text-sm">{item.AssetName}</td>
                                  <td className="px-4 py-2 text-sm">{item.Make}</td>
                                  <td className="px-4 py-2 text-sm">{item.Model}</td>
                                  <td className="px-4 py-2 text-sm">{item.Quantity}</td>
                                  <td className="px-4 py-2 text-sm">{item.RateIncludingTaxes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setFile(null)
                              setFileData([])
                            }}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>
                          <Button 
                          // onClick={handleBulkImport} 
                          disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Importing...
                              </>
                            ) : (
                              "Import Assets"
                            )}
                          </Button>
                        </div>
                      </div>
                    )} */}

                    {importSuccess && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-600">Success</AlertTitle>
                        <AlertDescription className="text-green-600">
                          Assets have been imported successfully.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  )
}

