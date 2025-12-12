"use client"

import { useState, useEffect } from "react"
import { Activity, Edit, MoreHorizontal, Plus, Search, Trash, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  useAddASpecialityMutation, 
  useDeleteASpecialityMutation, 
  useGetAllSpecialityQuery, 
  useUpdateASpecialityMutation 
} from "@/app/service/speciality"
import { toast } from "sonner"

export function SpecialtiesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  const [newSpecialty, setNewSpecialty] = useState({
    name: "",
    imageFile: null,
    imagePreview: null 
  })

  const [editSpecialty, setEditSpecialty] = useState({
    _id: "",
    name: "",
    picture: null ,
    imageFile: null ,
    imagePreview: null 
  })
  

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(7)

  // Fetch data
  const { data: apiData, isLoading, isError, refetch } = useGetAllSpecialityQuery();
  
  
  // Mutations
  const [addASpeciality, { isLoading: isAdding }] = useAddASpecialityMutation()
  const [deleteASpeciality, { isLoading: isDeleting }] = useDeleteASpecialityMutation()
  const [updateASpeciality, { isLoading: isUpdating }] = useUpdateASpecialityMutation()

  // Transform API data
  const specialties = apiData?.data || apiData || []

  // Filter specialties based on search term
  const filteredSpecialties = specialties.filter((specialty) => {
    const searchLower = searchTerm.toLowerCase()
    return specialty.name.toLowerCase().includes(searchLower)
  })

  // Pagination calculations
  const totalItems = filteredSpecialties.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredSpecialties.slice(startIndex, endIndex)

  // Handle image upload for add
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type", {
          description: "Please upload an image file"
        })
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Image must be less than 5MB"
        })
        return
      }

      setNewSpecialty({
        ...newSpecialty,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      })
    }
  }

  // Handle image upload for edit
  const handleEditImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type", {
          description: "Please upload an image file"
        })
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Image must be less than 5MB"
        })
        return
      }

      setEditSpecialty({
        ...editSpecialty,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      })
    }
  }

  // Remove image for add
  const removeImage = () => {
    if (newSpecialty.imagePreview) {
      URL.revokeObjectURL(newSpecialty.imagePreview)
    }
    setNewSpecialty({
      ...newSpecialty,
      imageFile: null,
      imagePreview: null
    })
  }

  // Remove image for edit
  const removeEditImage = () => {
    if (editSpecialty.imagePreview && editSpecialty.imagePreview !== editSpecialty.picture) {
      URL.revokeObjectURL(editSpecialty.imagePreview)
    }
    setEditSpecialty({
      ...editSpecialty,
      imageFile: null,
      imagePreview: editSpecialty.picture
    })
  }

  // Handle add specialty
  const handleAddSpecialty = async () => {
    try {
      const formData = new FormData()
      formData.append('name', newSpecialty.name)
      
      if (newSpecialty.imageFile) {
        formData.append('image', newSpecialty.imageFile)
      }

      // Debug: Log formData contents
      console.log("FormData contents:")
      for (let [key, value] of formData.entries()) {
        console.log(key, value)
      }

      // FIX: Pass formData directly, not as an object
      const result = await addASpeciality(formData).unwrap()

      console.log("Backend response:", result)

      toast.success("Specialty added successfully", {
        description: `${newSpecialty.name} has been added.`
      })

      setIsAddDialogOpen(false)
      
      // Clean up object URL
      if (newSpecialty.imagePreview) {
        URL.revokeObjectURL(newSpecialty.imagePreview)
      }
      
      setNewSpecialty({
        name: "",
        imageFile: null,
        imagePreview: null
      })
      refetch()
    } catch (error) {
      console.error("Failed to add specialty:", error)
      toast.error("Failed to add specialty", {
        description: error?.data?.message || "Please try again."
      })
    }
  }

  // Handle edit specialty
  const handleEditSpecialty = async () => {
    try {
      const formData = new FormData()
      formData.append('name', editSpecialty.name)
      
      if (editSpecialty.imageFile) {
        formData.append('image', editSpecialty.imageFile)
      }

      // Debug: Log formData contents
      console.log("Edit FormData contents:")
      for (let [key, value] of formData.entries()) {
        console.log(key, value)
      }

      // FIX: Pass data correctly
      const result = await updateASpeciality({
        id: editSpecialty._id,
        data: formData
      }).unwrap()

      console.log("Update response:", result)

      toast.success("Specialty updated successfully", {
        description: `${editSpecialty.name} has been updated.`
      })

      setIsEditDialogOpen(false)
      
      // Clean up object URL if it's not the original picture
      if (editSpecialty.imagePreview && editSpecialty.imagePreview !== editSpecialty.picture) {
        URL.revokeObjectURL(editSpecialty.imagePreview)
      }
      
      setEditSpecialty({
        _id: "",
        name: "",
        picture: null,
        imageFile: null,
        imagePreview: null
      })
      refetch()
    } catch (error) {
      console.error("Failed to update specialty:", error)
      toast.error("Failed to update specialty", {
        description: error?.data?.message || "Please try again."
      })
    }
  }

  // Handle delete specialty
  const handleDeleteSpecialty = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      const result = await deleteASpeciality(id).unwrap()

      toast.success("Specialty deleted successfully", {
        description: `${name} has been deleted.`
      })

      refetch()
    } catch (error) {
      console.error("Failed to delete specialty:", error)
      toast.error("Failed to delete specialty", {
        description: error?.data?.message || "Please try again."
      })
    }
  }

  // Open edit dialog
  const openEditDialog = (specialty) => {
    setEditSpecialty({
      _id: specialty._id,
      name: specialty.name,
      picture: specialty.picture || null,
      imageFile: null,
      imagePreview: specialty.picture || null
    })
    setIsEditDialogOpen(true)
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (newSpecialty.imagePreview) {
        URL.revokeObjectURL(newSpecialty.imagePreview)
      }
      if (editSpecialty.imagePreview && editSpecialty.imagePreview !== editSpecialty.picture) {
        URL.revokeObjectURL(editSpecialty.imagePreview)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p>Loading specialties...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-red-600">
            <p>Failed to load specialties</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Specialties</CardTitle>
            <CardDescription>
              Manage all medical specialties in the system
              {specialties.length > 0 && ` • ${specialties.length} total`}
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Specialty
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Specialty</DialogTitle>
                <DialogDescription>Enter the details of the new medical specialty here.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Specialty Name *</Label>
                  <Input
                    id="name"
                    value={newSpecialty.name}
                    onChange={(e) => setNewSpecialty({ ...newSpecialty, name: e.target.value })}
                    placeholder="Enter specialty name"
                    disabled={isAdding}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="image">Specialty Image</Label>
                  <div className="flex flex-col gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isAdding}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Upload an image for this specialty (Max 5MB)
                    </p>
                    
                    {newSpecialty.imagePreview && (
                      <div className="relative mt-2">
                        <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                          {/* Use regular img tag for blob URLs */}
                          <img
                            src={newSpecialty.imagePreview.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={removeImage}
                          disabled={isAdding}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isAdding}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddSpecialty} 
                  disabled={isAdding || !newSpecialty.name.trim()}
                >
                  {isAdding ? "Adding..." : "Add Specialty"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search specialties by name..."
                className="h-9 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        {searchTerm ? "No specialties found matching your search." : "No specialties available."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((specialty) => (
                      <TableRow key={specialty._id}>
                        <TableCell>
                          <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                            {specialty.picture ? (
                              // Use regular img tag for external URLs
                              <img
                                src={specialty?.picture?.imageUrl}
                                alt={specialty.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted">
                                <Activity className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {specialty.name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(specialty.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditDialog(specialty)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteSpecialty(specialty._id, specialty.name)}
                                disabled={isDeleting}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                {isDeleting ? "Deleting..." : "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Specialty</DialogTitle>
            <DialogDescription>Update the details of this medical specialty.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Specialty Name *</Label>
              <Input
                id="edit-name"
                value={editSpecialty.name}
                onChange={(e) => setEditSpecialty({ ...editSpecialty, name: e.target.value })}
                placeholder="Enter specialty name"
                disabled={isUpdating}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Specialty Image</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  disabled={isUpdating}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Upload a new image to replace the current one (Max 5MB)
                </p>
                
                {(editSpecialty?.imagePreview || editSpecialty.picture) && (
                  <div className="relative mt-2">
                    <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                      {/* Use regular img tag for blob URLs */}
                      <img
                        src={editSpecialty.imagePreview?.imageUrl || editSpecialty?.picture?.imageUrl || ""}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={removeEditImage}
                      disabled={isUpdating}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditSpecialty} 
              disabled={isUpdating || !editSpecialty.name.trim()}
            >
              {isUpdating ? "Updating..." : "Update Specialty"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}