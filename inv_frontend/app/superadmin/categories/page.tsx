"use client"

import { useEffect, useState } from "react"
import SuperAdminLayout from "@/components/layout/superadmin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Edit, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCreateCategoryMutation, useDeleteCategoryByIdMutation, useGetCategoryQuery, useUpdateCategoryMutation } from "@/lib/store/api/superAdmin/category/categoryApi"

// Mock data
const initialCategories = [
  { id: "1", name: "Computers", type: "Tangible", assetCount: 25 },
  { id: "2", name: "Furniture", type: "Tangible", assetCount: 42 },
  { id: "3", name: "Software", type: "Intangible", assetCount: 18 },
  { id: "4", name: "Office Equipment", type: "Tangible", assetCount: 31 },
  { id: "5", name: "Networking", type: "Tangible", assetCount: 15 },
]

export default function Categories() {
  const { data: categoryList,refetch:refetchCategoryList } = useGetCategoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
console.log("CATEGORY LIST:>>>>", categoryList?.data)
  const [categories, setCategories] = useState<any>(categoryList?.data)
  const [newCategory, setNewCategory] = useState({ name: "", type: "" })
  const [editCategory, setEditCategory] = useState<{ id: string; name: string; type: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryByIdMutation();

  // const {refetch } = useGetCategoryQuery(undefined, {
  //   refetchOnMountOrArgChange: true,
  // }); // Fetch categories
  useEffect(() => {
    if (categoryList?.data) {
      setCategories(categoryList.data); // Update categories state with fetched data
    }
  }, [categoryList?.data]);
  

  // const [deleteCategoryById] = useDeleteCategoryByIdMutation();
  const [createCategory] = useCreateCategoryMutation();
  // const [updateCategory] = useUpdateCategoryMutation();


  // const handleAddCategory = async () => {
  //   if (!newCategory.name || !newCategory.type) {
  //     setError("Please fill in all fields")
  //     return
  //   }

  //   setIsSubmitting(true)
  //   setError("")

  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000))

  //     const newId = (categories.length + 1).toString()
  //     setCategories([...categories, { id: newId, name: newCategory.name, type: newCategory.type, assetCount: 0 }])

  //     setNewCategory({ name: "", type: "" })
  //     setSuccess("Category added successfully")
  //     setIsAddDialogOpen(false)
  //   } catch (err) {
  //     setError("Failed to add category")
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }


  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.type) {
      setError("Please fill in all fields");
      return;
    }
  
    setIsSubmitting(true);
    setError("");
    setSuccess("");
  
    try {
      // Prepare payload for API
      const payload:any = {
        name: newCategory.name,
        type: newCategory.type,
      };
  
      // Actual API call
      const response = await createCategory(payload).unwrap();
      console.log("Category Created:", response);
  
      // Optionally update local UI if needed
      setNewCategory({ name: "", type: "" });
      setSuccess("Category added successfully");
      setIsAddDialogOpen(false);
      refetchCategoryList(); // Refresh categories list
    } catch (err) {
      console.error("Failed to add category:", err);
      setError("Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };
  



const handleEditCategory = async () => {
  if (!editCategory?.name || !editCategory?.type) {
    setError("Please fill in all fields");
    return;
  }

  setIsSubmitting(true);
  setError("");
  setSuccess("");

  try {
    const updatedCategory = await updateCategory({
      id: editCategory.id,
      updates: {
        name: editCategory.name,
        type: editCategory.type,
      },
    }).unwrap();

    // Update categories state with updated category
    setCategories(categories.map(cat => cat._id === updatedCategory._id ? updatedCategory : cat));

    setEditCategory(null);
    setIsEditDialogOpen(false);
    refetchCategoryList();
    setSuccess("Category updated successfully");
  } catch (err: any) {
    setError(err?.data?.message || "Failed to update category");
  } finally {
    setIsSubmitting(false);
  }
};

  // const handleDeleteCategory = async () => {
  //   if (!categoryToDelete) return

  //   setIsSubmitting(true)
  //   setError("")

  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000))

  //     setCategories(categories?.filter((cat:any) => cat.id !== categoryToDelete))
  //     setCategoryToDelete(null)
  //     setSuccess("Category deleted successfully")
  //     setIsDeleteDialogOpen(false)
  //   } catch (err) {
  //     setError("Failed to delete category")
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
  
    setIsSubmitting(true);
    setError("");
    setSuccess("");
  
    try {
      // 🔥 Use your deleteCategory mutation with the correct ID
      await deleteCategory(categoryToDelete).unwrap();
  
      // ✅ Remove the deleted category from state
      setCategories(categories?.filter((cat: any) => cat._id !== categoryToDelete));
  
      setSuccess("Category deleted successfully");
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to delete category");
    } finally {
      setIsSubmitting(false);
    }
  };
  


  const openEditDialog = (category:any) => {
    debugger
    setEditCategory({
      id: category._id,
      name: category.name,
      type: category.type,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (id: string) => {
    debugger
    setCategoryToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Manage Categories</h1>
          <div className="mt-4 sm:mt-0">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add New Category</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>Create a new category for organizing assets.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Category Type</Label>
                    <Select
                      value={newCategory.type}
                      onValueChange={(value) => setNewCategory({ ...newCategory, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tangible">Tangible</SelectItem>
                        <SelectItem value="Intangible">Intangible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory} disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Category"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">Success</AlertTitle>
            <AlertDescription className="text-green-600">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Asset Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Asset Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories?.map((category:any,i:any) => (
                      <TableRow key={category._id}>
                        <TableCell>{i+1}</TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              category.type === "Tangible"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }
                          >
                            {category.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{category.assetCount}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(category._id)}
                            disabled={category.assetCount > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={editCategory?.name || ""}
                onChange={(e) => setEditCategory(editCategory ? { ...editCategory, name: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Category Type</Label>
              <Select
                value={editCategory?.type || ""}
                onValueChange={(value) => setEditCategory(editCategory ? { ...editCategory, type: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tangible">Tangible</SelectItem>
                  <SelectItem value="Intangible">Intangible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  )
}

