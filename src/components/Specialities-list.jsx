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
    picture: null,
    imageFile: null,
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

  // Debug API data structure
  useEffect(() => {
    if (apiData) {
      console.log("API Data structure:", apiData);
      if (specialties.length > 0) {
        console.log("First specialty:", specialties[0]);
        console.log("First specialty picture:", specialties[0]?.picture);
        console.log("Picture type:", typeof specialties[0]?.picture);
      }
    }
  }, [apiData, specialties]);

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

  // Helper function to get image URL
  const getImageUrl = (imageData) => {
    if (!imageData) return null;
    
    // If it's already a string URL
    if (typeof imageData === 'string') {
      return imageData;
    }
    
    // If it's an object with imageUrl property
    if (imageData && imageData.imageUrl) {
      return imageData.imageUrl;
    }
    
    // If it's an object with url property
    if (imageData && imageData.url) {
      return imageData.url;
    }
    
    // If it's a File object with preview
    if (imageData instanceof File || (imageData && imageData.type === 'image')) {
      return URL.createObjectURL(imageData);
    }
    
    return null;
  };

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

      const imagePreview = URL.createObjectURL(file);
      
      setNewSpecialty({
        ...newSpecialty,
        imageFile: file,
        imagePreview: imagePreview
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

      const imagePreview = URL.createObjectURL(file);
      
      setEditSpecialty({
        ...editSpecialty,
        imageFile: file,
        imagePreview: imagePreview
      })
    }
  }

  // Remove image for add
  const removeImage = () => {
    if (newSpecialty.imagePreview && typeof newSpecialty.imagePreview === 'string') {
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
    // If we have a new image preview (blob URL), revoke it
    if (editSpecialty.imagePreview && typeof editSpecialty.imagePreview === 'string' && editSpecialty.imageFile) {
      URL.revokeObjectURL(editSpecialty.imagePreview)
    }
    
    // Reset to original picture
    setEditSpecialty({
      ...editSpecialty,
      imageFile: null,
      imagePreview: getImageUrl(editSpecialty.picture) // Use original picture
    })
  }

  // Handle add specialty
  const handleAddSpecialty = async () => {
    try {
      if (!newSpecialty.name.trim()) {
        toast.error("Name is required", {
          description: "Please enter a specialty name."
        });
        return;
      }

      const formData = new FormData()
      formData.append('name', newSpecialty.name)
      
      if (newSpecialty.imageFile) {
        formData.append('image', newSpecialty.imageFile)
      }

      // Debug: Log formData contents
      console.log("Add FormData contents:")
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `${value.name} (${value.type})` : value)
      }

      const result = await addASpeciality(formData).unwrap()

      console.log("Add response:", result)

      toast.success("Specialty added successfully", {
        description: `${newSpecialty.name} has been added.`
      })

      setIsAddDialogOpen(false)
      
      // Clean up object URL
      if (newSpecialty.imagePreview && typeof newSpecialty.imagePreview === 'string') {
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
        description: error?.data?.message || error?.error || "Please try again."
      })
    }
  }

  // Handle edit specialty
  const handleEditSpecialty = async () => {
    try {
      if (!editSpecialty.name.trim()) {
        toast.error("Name is required", {
          description: "Please enter a specialty name."
        });
        return;
      }

      const formData = new FormData();
      formData.append('name', editSpecialty.name);
      
      // Only append image if a new file was selected
      if (editSpecialty.imageFile) {
        formData.append('image', editSpecialty.imageFile);
        console.log("Appending new image file:", editSpecialty.imageFile.name);
      } else {
        console.log("No new image file selected");
      }

      // Debug: Log formData contents
      console.log("Edit FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `${value.name} (${value.type})` : value);
      }

      console.log("Sending update with ID:", editSpecialty._id);

      // Try different formats based on your API
      let result;
      try {
        // Format 1: Most common for FormData
        result = await updateASpeciality({
          id: editSpecialty._id,
          data: formData
        }).unwrap();
      } catch (formatError) {
        console.log("Format 1 failed, trying Format 2");
        
        // Format 2: Direct FormData (some APIs expect just FormData)
        const dataWithId = new FormData();
        dataWithId.append('name', editSpecialty.name);
        if (editSpecialty.imageFile) {
          dataWithId.append('image', editSpecialty.imageFile);
        }
        
        result = await updateASpeciality({
          _id: editSpecialty._id,
          data: dataWithId
        }).unwrap();
      }

      console.log("Update response:", result);

      toast.success("Specialty updated successfully", {
        description: `${editSpecialty.name} has been updated.`
      });

      setIsEditDialogOpen(false);
      
      // Clean up object URL if it's a new image
      if (editSpecialty.imagePreview && typeof editSpecialty.imagePreview === 'string' && editSpecialty.imageFile) {
        URL.revokeObjectURL(editSpecialty.imagePreview);
      }
      
      // Reset edit state
      setEditSpecialty({
        _id: "",
        name: "",
        picture: null,
        imageFile: null,
        imagePreview: null
      });
      
      // Refresh data
      refetch();
    } catch (error) {
      console.error("Failed to update specialty:", error);
      
      // More detailed error logging
      console.error("Error details:", {
        status: error?.status,
        data: error?.data,
        message: error?.message,
        originalArgs: error?.meta?.arg
      });
      
      toast.error("Failed to update specialty", {
        description: error?.data?.message || error?.error || error?.message || "Please try again."
      });
    }
  };

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
    console.log("Opening edit dialog for:", specialty);
    console.log("Picture data:", specialty.picture);
    
    const pictureUrl = getImageUrl(specialty.picture);
    console.log("Picture URL:", pictureUrl);
    
    setEditSpecialty({
      _id: specialty._id,
      name: specialty.name,
      picture: specialty.picture,
      imageFile: null,
      imagePreview: pictureUrl
    });
    setIsEditDialogOpen(true);
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
      if (newSpecialty.imagePreview && typeof newSpecialty.imagePreview === 'string') {
        URL.revokeObjectURL(newSpecialty.imagePreview)
      }
      if (editSpecialty.imagePreview && typeof editSpecialty.imagePreview === 'string' && editSpecialty.imageFile) {
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
                          <img
                            src={newSpecialty.imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onLoad={() => console.log("Image loaded successfully")}
                            onError={(e) => console.error("Image failed to load", e)}
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
                    currentItems.map((specialty) => {
                      const imageUrl = getImageUrl(specialty.picture);
                      return (
                        <TableRow key={specialty._id}>
                          <TableCell>
                            <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={specialty.name}
                                  className="w-full h-full object-cover"
                                  onLoad={() => console.log(`Image loaded for ${specialty.name}`)}
                                  onError={(e) => {
                                    console.error(`Image failed to load for ${specialty.name}:`, imageUrl);
                                    e.target.style.display = 'none';
                                    // Show fallback icon
                                    const parent = e.target.parentElement;
                                    parent.innerHTML = `
                                      <div class="w-full h-full flex items-center justify-center bg-muted">
                                        <svg class="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                    `;
                                  }}
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
                            {specialty.createdAt ? new Date(specialty.createdAt).toLocaleDateString() : 'N/A'}
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
                      )
                    })
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
                
                {editSpecialty.imagePreview && (
                  <div className="relative mt-2">
                    <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                      <img
                        src={editSpecialty.imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onLoad={() => console.log("Edit image loaded successfully")}
                        onError={(e) => {
                          console.error("Edit image failed to load:", editSpecialty.imagePreview);
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-muted">
                              <p class="text-xs text-center p-2">Image not available</p>
                            </div>
                          `;
                        }}
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
                    <p className="text-xs text-muted-foreground mt-1">
                      {editSpecialty.imageFile ? "New image selected" : "Current image"}
                    </p>
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