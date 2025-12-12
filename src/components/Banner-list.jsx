"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Edit, MoreHorizontal, Plus, Search, Image as ImageIcon, Trash, Upload, ChevronDown, Check } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAddAHospitalBannerMutation, useDeleteAHospitalBannerMutation, useGetAllHospitalBannerQuery, useUpdateAHospitalBannerMutation } from "@/app/service/banners"
import { useGetAllHospitalQuery } from "@/app/service/hospital"
import { toast } from "sonner"

export function BannerList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [hospitalFilter, setHospitalFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [banners, setBanners] = useState([])
  const [editingBanner, setEditingBanner] = useState(null)
  const [bannerToDelete, setBannerToDelete] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)
  
  // Form states
  const [selectedHospitalId, setSelectedHospitalId] = useState("")
  const [selectedHospitalName, setSelectedHospitalName] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [description, setDescription] = useState("")
  
  // Hospital search for dropdown
  const [hospitalSearch, setHospitalSearch] = useState("")
  const [isHospitalDropdownOpen, setIsHospitalDropdownOpen] = useState(false)
  
  // For edit form
  const [editSelectedFile, setEditSelectedFile] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState("")
  const [editStartDate, setEditStartDate] = useState("")
  const [editEndDate, setEditEndDate] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const { data: bannersData, isLoading, isError, refetch } = useGetAllHospitalBannerQuery()
  const { data: hospitalData } = useGetAllHospitalQuery()
  const [addAHospitalBanner, { isLoading: isAdding }] = useAddAHospitalBannerMutation()
  const [deleteAHospitalBanner, { isLoading: isDeleting }] = useDeleteAHospitalBannerMutation()
  const [updateAHospitalBanner, { isLoading: isUpdating }] = useUpdateAHospitalBannerMutation()

  // Transform API data into banners list
  useEffect(() => {
    if (bannersData) {
      const bannersList = []
      
      bannersData.forEach(hospital => {
        if (hospital.ads && hospital.ads.length > 0) {
          hospital.ads.forEach(ad => {
            bannersList.push({
              id: ad._id,
              adId: ad._id,
              imageUrl: ad.imageUrl,
              publicId: ad.public_id,
              startDate: ad.startDate ? new Date(ad.startDate).toLocaleDateString() : "",
              endDate: ad.endDate ? new Date(ad.endDate).toLocaleDateString() : "",
              hospitalId: hospital._id,
              hospitalName: hospital.name,
              description: ad.description || "",
              status: ad.status || "active",
              createdAt: ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : "",
            })
          })
        }
      })

      setBanners(bannersList)
    }
  }, [bannersData])

  // Filtered hospitals for searchable dropdown
  const filteredHospitals = useMemo(() => {
    if (!hospitalData) return []
    return hospitalData?.data?.filter(hospital =>
      hospital.name.toLowerCase().includes(hospitalSearch.toLowerCase())
    )
  }, [hospitalData, hospitalSearch])

  // Filter banners based on search term and hospital
  const filteredBanners = banners.filter((banner) => {
    const matchesSearch =
      banner.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (banner.description && banner.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesHospital = hospitalFilter === "all" || banner.hospitalId === hospitalFilter
    
    return matchesSearch && matchesHospital
  })

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBanners.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage)

  // Get unique hospitals for filter dropdown
  const hospitals = [...new Set(banners.map(banner => ({
    id: banner.hospitalId,
    name: banner.hospitalName
  })))].sort((a, b) => a.name.localeCompare(b.name))

  // File handling functions
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleEditFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setEditSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setEditImagePreview(previewUrl)
    }
  }

  const handleHospitalSelect = (hospitalId, hospitalName) => {
    setSelectedHospitalId(hospitalId)
    setSelectedHospitalName(hospitalName)
    setIsHospitalDropdownOpen(false)
    setHospitalSearch("")
  }

  const handleAddBanner = async () => {
    // Validation
    if (!selectedHospitalId) {
      toast.warning("Please select a hospital")
      return
    }

    if (!selectedFile) {
      toast.warning("Please select an image file")
      return
    }

    if (!startDate) {
      toast.warning("Please select a start date")
      return
    }

    if (!endDate) {
      toast.warning("Please select an end date")
      return
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (end <= start) {
      toast.warning("End date must be after start date")
      return
    }

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("image", selectedFile)
      formData.append("startDate", startDate)
      formData.append("endDate", endDate)
      if (description.trim()) {
        formData.append("description", description)
      }

      await addAHospitalBanner({
        hospitalId: selectedHospitalId,
        data: formData  // Pass FormData directly
      }).unwrap()

      toast.success("Banner added successfully!")
      refetch()
      resetAddForm()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Failed to add banner:", error)
      toast.error("Failed to add banner:");
    }
  }

  const handleEditBanner = async () => {
    if (!editingBanner) return

    // Validation
    if (!editStartDate) {
      toast.warning("Please select a start date")
      return
    }

    if (!editEndDate) {
      toast.warning("Please select an end date")
      return
    }

    // Validate dates
    const start = new Date(editStartDate)
    const end = new Date(editEndDate)
    if (end <= start) {
      toast.warning("End date must be after start date")
      return
    }

    try {
      // Create FormData for file upload
      const formData = new FormData()
      if (editSelectedFile) {
        formData.append("image", editSelectedFile)
      }
      formData.append("startDate", editStartDate)
      formData.append("endDate", editEndDate)
      if (editDescription.trim()) {
        formData.append("description", editDescription)
      }

      await updateAHospitalBanner({
        adId: editingBanner.adId,
        hospitalId: editingBanner.hospitalId,
        updateAd: formData  // Pass FormData directly
      }).unwrap()

      toast.success("Banner updated successfully!")
      refetch()
      resetEditForm()
      setIsEditDialogOpen(false)
      setEditingBanner(null)
    } catch (error) {
      console.error("Failed to update banner:", error)
      toast.error("Failed to update banner. Please try again.")
    }
  }

  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return

    try {
      await deleteAHospitalBanner({
        hospitalId: bannerToDelete.hospitalId,
        adId: bannerToDelete.adId
      }).unwrap()

      toast.success("Banner deleted successfully!")
      refetch()
      setIsDeleteDialogOpen(false)
      setBannerToDelete(null)
    } catch (error) {
      console.error("Failed to delete banner:", error)
      toast.error("Failed to delete banner. Please try again.")
    }
  }

  const openEditDialog = (banner) => {
    setEditingBanner(banner)
    setEditImagePreview(banner.imageUrl)
    setEditStartDate(banner.startDate ? banner.startDate.split('T')[0] : '')
    setEditEndDate(banner.endDate ? banner.endDate.split('T')[0] : '')
    setEditDescription(banner.description || "")
    setEditSelectedFile(null)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (banner) => {
    setBannerToDelete(banner)
    setIsDeleteDialogOpen(true)
  }

  const resetAddForm = () => {
    setSelectedHospitalId("")
    setSelectedHospitalName("")
    setSelectedFile(null)
    setImagePreview("")
    setStartDate("")
    setEndDate("")
    setDescription("")
    setHospitalSearch("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const resetEditForm = () => {
    setEditSelectedFile(null)
    setEditImagePreview("")
    setEditStartDate("")
    setEditEndDate("")
    setEditDescription("")
    if (editFileInputRef.current) {
      editFileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const triggerEditFileInput = () => {
    editFileInputRef.current?.click()
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Hospital Banners</h2>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading banners...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Hospital Banners</h2>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">Error loading banners</p>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Hospital Banners</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
              <DialogDescription>Upload a banner image and set the display period.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Searchable Hospital Selection */}
              <div className="grid gap-2">
                <Label htmlFor="hospital">Select Hospital *</Label>
                <div className="relative">
                  <div 
                    className="flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsHospitalDropdownOpen(!isHospitalDropdownOpen)}
                  >
                    <div className="flex items-center gap-2">
                      {selectedHospitalName ? (
                        <span className="font-medium">{selectedHospitalName}</span>
                      ) : (
                        <span className="text-muted-foreground">Choose a hospital</span>
                      )}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isHospitalDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {isHospitalDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md">
                      {/* Search Input */}
                      <div className="p-2 border-b">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search hospitals..."
                            className="pl-8"
                            value={hospitalSearch}
                            onChange={(e) => setHospitalSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      
                      {/* Hospital List */}
                      <ScrollArea className="h-64">
                        <div className="p-1">
                          {filteredHospitals.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                              No hospitals found
                            </div>
                          ) : (
                            filteredHospitals.map((hospital) => (
                              <div
                                key={hospital._id}
                                className={`flex items-center justify-between px-3 py-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${selectedHospitalId === hospital._id ? 'bg-accent' : ''}`}
                                onClick={() => handleHospitalSelect(hospital._id, hospital.name)}
                              >
                                <div className="flex items-center">
                                  <span>{hospital.name}</span>
                                </div>
                                {selectedHospitalId === hospital._id && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div className="grid gap-2">
                <Label htmlFor="image">Banner Image *</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerFileInput}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {selectedFile && (
                      <span className="text-sm text-muted-foreground">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Banner preview"
                        className="w-full h-40 object-contain rounded-md border"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200x400 pixels. Max file size: 5MB
                </p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description for this banner..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetAddForm()
                setIsAddDialogOpen(false)
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddBanner} disabled={isAdding}>
                {isAdding ? "Uploading..." : "Upload Banner"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Banners List</CardTitle>
            <CardDescription>Manage all hospital banner advertisements</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full items-center space-x-2 sm:w-auto">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by hospital or description..."
                  className="h-9 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <Select
                value={hospitalFilter}
                onValueChange={(value) => {
                  setHospitalFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-9 w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hospitals</SelectItem>
                  {hospitals.map((hospital) => (
                    <SelectItem key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Banners Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No banners found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {banner.imageUrl ? (
                              <img
                                src={banner.imageUrl}
                                alt={`Banner for ${banner.hospitalName}`}
                                className="h-16 w-32 object-cover rounded-md border"
                              />
                            ) : (
                              <div className="h-16 w-32 flex items-center justify-center bg-muted rounded-md border">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {banner.hospitalName}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-col text-sm">
                            <span>From: {banner.startDate || "N/A"}</span>
                            <span>To: {banner.endDate || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {banner.description || "No description"}
                          </p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              banner.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            {banner.status || "active"}
                          </span>
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
                              <DropdownMenuItem onClick={() => openEditDialog(banner)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => openDeleteDialog(banner)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredBanners.length > 0 && (
              <div className="flex w-full items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{indexOfFirstItem + 1}</strong> to{" "}
                  <strong>{Math.min(indexOfLastItem, filteredBanners.length)}</strong> of{" "}
                  <strong>{filteredBanners.length}</strong> banners
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Banner Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Update the banner image and details.</DialogDescription>
          </DialogHeader>
          {editingBanner && (
            <div className="grid gap-4 py-4">
              {/* Hospital Info (Read-only) */}
              <div className="grid gap-2">
                <Label>Hospital</Label>
                <Input
                  value={editingBanner.hospitalName}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* File Upload */}
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Banner Image</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerEditFileInput}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Change Image
                    </Button>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileSelect}
                      className="hidden"
                    />
                    {editSelectedFile && (
                      <span className="text-sm text-muted-foreground">
                        {editSelectedFile.name}
                      </span>
                    )}
                  </div>
                  
                  {editImagePreview && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <img
                        src={editImagePreview}
                        alt="Banner preview"
                        className="w-full h-40 object-contain rounded-md border"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty to keep current image
                </p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-startDate">Start Date *</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-endDate">End Date *</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a description for this banner..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetEditForm()
              setIsEditDialogOpen(false)
              setEditingBanner(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditBanner} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this banner? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {bannerToDelete && (
            <div className="py-4">
              <div className="flex items-center gap-3">
                {bannerToDelete.imageUrl && (
                  <img
                    src={bannerToDelete.imageUrl}
                    alt={`Banner for ${bannerToDelete.hospitalName}`}
                    className="h-16 w-32 object-cover rounded-md border"
                  />
                )}
                <div>
                  <p className="font-medium">{bannerToDelete.hospitalName}</p>
                  <p className="text-sm text-muted-foreground">
                    {bannerToDelete.startDate} to {bannerToDelete.endDate}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteBanner}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}