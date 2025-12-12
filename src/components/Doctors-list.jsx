"use client"

import { useState, useEffect } from "react"
import { Edit, MoreHorizontal, Plus, Search, Stethoscope, Trash } from "lucide-react"
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
import { useGetAllDoctorsQuery } from "@/app/service/doctors"

export function DoctorsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [allDoctors, setAllDoctors] = useState([])
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    hospital: "",
    contact: "",
    experience: "",
  })

  const { data: apiData, isLoading, isError, refetch } = useGetAllDoctorsQuery()

  // Transform API data into doctors list
  useEffect(() => {
    if (apiData && apiData.hospitals) {
      const doctorsFromApi = []
      
      apiData.hospitals.forEach(hospital => {
        if (hospital.doctors && hospital.doctors.length > 0) {
          hospital.doctors.forEach(doctor => {
            doctorsFromApi.push({
              id: doctor._id,
              name: doctor.name,
              specialty: doctor.specialty || "GENERAL MEDICINE",
              qualification: doctor.qualification || "",
              hospital: hospital.name,
              hospitalId: hospital.id,
              contact: hospital.phone || "N/A",
              experience: "", // You might need to add this field to your backend
              status: doctor.bookingOpen ? "Available" : "Not Available",
              consultingHours: doctor.consulting || [],
              department: doctor.department_info || "",
            })
          })
        }
      })

      setAllDoctors(doctorsFromApi)
    }
  }, [apiData])

  // Filter doctors based on search term and specialty
  const filteredDoctors = allDoctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecialty = specialtyFilter === "all" || 
      doctor.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())
    
    return matchesSearch && matchesSpecialty
  })

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)

  // Get unique specialties for filter dropdown
  const specialties = [...new Set(allDoctors.map(doctor => doctor.specialty))].sort()

  const handleAddDoctor = () => {
    const newId = `temp-${Date.now()}`
    const doctorToAdd = {
      id: newId,
      name: newDoctor.name,
      specialty: newDoctor.specialty,
      qualification: "",
      hospital: newDoctor.hospital,
      hospitalId: "",
      contact: newDoctor.contact,
      experience: newDoctor.experience,
      status: "Available",
      consultingHours: [],
      department: "",
    }

    setAllDoctors([...allDoctors, doctorToAdd])

    // Note: In a real application, you would make an API call here
    alert(`${newDoctor.name} has been added successfully.`)

    setIsAddDialogOpen(false)
    setNewDoctor({
      name: "",
      specialty: "",
      hospital: "",
      contact: "",
      experience: "",
    })
  }

  const handleEditDoctor = () => {
    setAllDoctors(allDoctors.map((doctor) => (doctor.id === editingDoctor.id ? editingDoctor : doctor)))

    // Note: In a real application, you would make an API call here
    alert(`${editingDoctor.name} has been updated successfully.`)

    setIsEditDialogOpen(false)
    setEditingDoctor(null)
  }

  // const handleDeleteDoctor = (id, name) => {
  //   setAllDoctors(allDoctors.filter((doctor) => doctor.id !== id))

  //   // Note: In a real application, you would make an API call here
  //   alert(`${name} has been deleted successfully.`)
  // }

  // const openEditDialog = (doctor) => {
  //   setEditingDoctor({ ...doctor })
  //   setIsEditDialogOpen(true)
  // }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Doctors</h2>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading doctors...</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Doctors</h2>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">Error loading doctors</p>
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
        <h2 className="text-3xl font-bold tracking-tight">Doctors</h2>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Doctors List</CardTitle>
            <CardDescription>Manage all doctors in the system</CardDescription>
          </div>
          {/* <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
                <DialogDescription>Enter the details of the new doctor here.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Doctor Name</Label>
                  <Input
                    id="name"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    placeholder="Enter doctor name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select
                    onValueChange={(value) => setNewDoctor({ ...newDoctor, specialty: value })}
                    defaultValue={newDoctor.specialty}
                  >
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GENERAL MEDICINE">GENERAL MEDICINE</SelectItem>
                      <SelectItem value="ORTHOPEDICS">ORTHOPEDICS</SelectItem>
                      <SelectItem value="OBSTETRICS & GYNECOLOGY">OBSTETRICS & GYNECOLOGY</SelectItem>
                      <SelectItem value="ENT">ENT</SelectItem>
                      <SelectItem value="DERMATOLOGY">DERMATOLOGY</SelectItem>
                      <SelectItem value="PEDIATRICS">PEDIATRICS</SelectItem>
                      <SelectItem value="CARDIOLOGY">CARDIOLOGY</SelectItem>
                      <SelectItem value="NEUROLOGY">NEUROLOGY</SelectItem>
                      <SelectItem value="PSYCHIATRY">PSYCHIATRY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hospital">Hospital</Label>
                  <Input
                    id="hospital"
                    value={newDoctor.hospital}
                    onChange={(e) => setNewDoctor({ ...newDoctor, hospital: e.target.value })}
                    placeholder="Enter hospital name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    value={newDoctor.contact}
                    onChange={(e) => setNewDoctor({ ...newDoctor, contact: e.target.value })}
                    placeholder="Enter contact number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                    placeholder="Enter years of experience"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDoctor}>Add Doctor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}

          {/* Edit Doctor Dialog
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Doctor</DialogTitle>
                <DialogDescription>Update the doctor details.</DialogDescription>
              </DialogHeader>
              {editingDoctor && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Doctor Name</Label>
                    <Input
                      id="edit-name"
                      value={editingDoctor.name}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-specialty">Specialty</Label>
                    <Select
                      value={editingDoctor.specialty}
                      onValueChange={(value) => setEditingDoctor({ ...editingDoctor, specialty: value })}
                    >
                      <SelectTrigger id="edit-specialty">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-hospital">Hospital</Label>
                    <Input
                      id="edit-hospital"
                      value={editingDoctor.hospital}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, hospital: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-contact">Contact Number</Label>
                    <Input
                      id="edit-contact"
                      value={editingDoctor.contact}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, contact: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-experience">Experience</Label>
                    <Input
                      id="edit-experience"
                      value={editingDoctor.experience}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, experience: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editingDoctor.status}
                      onValueChange={(value) => setEditingDoctor({ ...editingDoctor, status: value })}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditDoctor}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full items-center space-x-2 sm:w-auto">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors..."
                  className="h-9 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1) // Reset to first page on search
                  }}
                />
              </div>
              <Select
                value={specialtyFilter}
                onValueChange={(value) => {
                  setSpecialtyFilter(value)
                  setCurrentPage(1) // Reset to first page on filter change
                }}
              >
                <SelectTrigger className="h-9 w-full sm:w-[180px]">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead className="hidden md:table-cell">Hospital</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Qualification</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No doctors found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-muted-foreground" />
                            {doctor.name}
                          </div>
                        </TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell className="hidden md:table-cell">{doctor.hospital}</TableCell>
                        <TableCell className="hidden md:table-cell">{doctor.contact}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {doctor.qualification || "N/A"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              doctor.status === "Available"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : doctor.status === "On Leave"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            {doctor.status}
                          </span>
                        </TableCell>
                        {/* <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditDialog(doctor)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteDoctor(doctor.id, doctor.name)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell> */}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredDoctors.length > 0 && (
              <div className="flex w-full items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{indexOfFirstItem + 1}</strong> to{" "}
                  <strong>{Math.min(indexOfLastItem, filteredDoctors.length)}</strong> of{" "}
                  <strong>{filteredDoctors.length}</strong> doctors
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
    </div>
  )
}