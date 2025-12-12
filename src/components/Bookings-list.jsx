// "use client"

// import { useState, useEffect } from "react"
// import { Edit, MoreHorizontal, Plus, Search, Stethoscope, Trash } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useGetAllDoctorsQuery } from "@/app/service/doctors"
// import { useGetAllQuery } from "@/app/service/bookings"

// export function BookingList() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [specialtyFilter, setSpecialtyFilter] = useState("all")
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage] = useState(10)
//   const [allDoctors, setAllDoctors] = useState([])
//   const [editingDoctor, setEditingDoctor] = useState(null)
//   const [newDoctor, setNewDoctor] = useState({
//     name: "",
//     specialty: "",
//     hospital: "",
//     contact: "",
//     experience: "",
//   })


//     const { data } = useGetAllQuery();
  
//     console.log(data, "hiiiloos");
    


//   // Transform API data into doctors list
//   useEffect(() => {
//     if (apiData && apiData.hospitals) {
//       const doctorsFromApi = []
      
//       apiData.hospitals.forEach(hospital => {
//         if (hospital.doctors && hospital.doctors.length > 0) {
//           hospital.doctors.forEach(doctor => {
//             doctorsFromApi.push({
//               id: doctor._id,
//               name: doctor.name,
//               specialty: doctor.specialty || "GENERAL MEDICINE",
//               qualification: doctor.qualification || "",
//               hospital: hospital.name,
//               hospitalId: hospital.id,
//               contact: hospital.phone || "N/A",
//               experience: "", // You might need to add this field to your backend
//               status: doctor.bookingOpen ? "Available" : "Not Available",
//               consultingHours: doctor.consulting || [],
//               department: doctor.department_info || "",
//             })
//           })
//         }
//       })

//       setAllDoctors(doctorsFromApi)
//     }
//   }, [apiData])

//   // Filter doctors based on search term and specialty
//   const filteredDoctors = allDoctors.filter((doctor) => {
//     const matchesSearch =
//       doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    
//     const matchesSpecialty = specialtyFilter === "all" || 
//       doctor.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())
    
//     return matchesSearch && matchesSpecialty
//   })

//   // Calculate pagination
//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentItems = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem)
//   const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)

//   // Get unique specialties for filter dropdown
//   const specialties = [...new Set(allDoctors.map(doctor => doctor.specialty))].sort()

//   const handleAddDoctor = () => {
//     const newId = `temp-${Date.now()}`
//     const doctorToAdd = {
//       id: newId,
//       name: newDoctor.name,
//       specialty: newDoctor.specialty,
//       qualification: "",
//       hospital: newDoctor.hospital,
//       hospitalId: "",
//       contact: newDoctor.contact,
//       experience: newDoctor.experience,
//       status: "Available",
//       consultingHours: [],
//       department: "",
//     }

//     setAllDoctors([...allDoctors, doctorToAdd])

//     // Note: In a real application, you would make an API call here
//     alert(`${newDoctor.name} has been added successfully.`)

//     setIsAddDialogOpen(false)
//     setNewDoctor({
//       name: "",
//       specialty: "",
//       hospital: "",
//       contact: "",
//       experience: "",
//     })
//   }

//   const handleEditDoctor = () => {
//     setAllDoctors(allDoctors.map((doctor) => (doctor.id === editingDoctor.id ? editingDoctor : doctor)))

//     // Note: In a real application, you would make an API call here
//     alert(`${editingDoctor.name} has been updated successfully.`)

//     setIsEditDialogOpen(false)
//     setEditingDoctor(null)
//   }


//   if (isLoading) {
//     return (
//       <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
//         <div className="flex items-center justify-between">
//           <h2 className="text-3xl font-bold tracking-tight">Doctors</h2>
//         </div>
//         <Card>
//           <CardContent className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//               <p className="text-muted-foreground">Loading doctors...</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   if (isError) {
//     return (
//       <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
//         <div className="flex items-center justify-between">
//           <h2 className="text-3xl font-bold tracking-tight">Doctors</h2>
//         </div>
//         <Card>
//           <CardContent className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <p className="text-destructive mb-4">Error loading doctors</p>
//               <Button onClick={() => refetch()}>Retry</Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
//       <div className="flex items-center justify-between">
//         <h2 className="text-3xl font-bold tracking-tight">Doctors</h2>
//       </div>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <div>
//             <CardTitle className="text-xl font-bold">Doctors List</CardTitle>
//             <CardDescription>Manage all doctors in the system</CardDescription>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col gap-4">
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex w-full items-center space-x-2 sm:w-auto">
//                 <Search className="h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search doctors..."
//                   className="h-9 w-full sm:w-[300px]"
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value)
//                     setCurrentPage(1) // Reset to first page on search
//                   }}
//                 />
//               </div>
//               <Select
//                 value={specialtyFilter}
//                 onValueChange={(value) => {
//                   setSpecialtyFilter(value)
//                   setCurrentPage(1) // Reset to first page on filter change
//                 }}
//               >
//                 <SelectTrigger className="h-9 w-full sm:w-[180px]">
//                   <SelectValue placeholder="Select specialty" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Specialties</SelectItem>
//                   {specialties.map((specialty) => (
//                     <SelectItem key={specialty} value={specialty}>
//                       {specialty}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Specialty</TableHead>
//                     <TableHead className="hidden md:table-cell">Hospital</TableHead>
//                     <TableHead className="hidden md:table-cell">Contact</TableHead>
//                     <TableHead className="hidden md:table-cell">Qualification</TableHead>
//                     <TableHead className="hidden md:table-cell">Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {currentItems.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={7} className="h-24 text-center">
//                         No doctors found.
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     currentItems.map((doctor) => (
//                       <TableRow key={doctor.id}>
//                         <TableCell className="font-medium">
//                           <div className="flex items-center gap-2">
//                             <Stethoscope className="h-4 w-4 text-muted-foreground" />
//                             {doctor.name}
//                           </div>
//                         </TableCell>
//                         <TableCell>{doctor.specialty}</TableCell>
//                         <TableCell className="hidden md:table-cell">{doctor.hospital}</TableCell>
//                         <TableCell className="hidden md:table-cell">{doctor.contact}</TableCell>
//                         <TableCell className="hidden md:table-cell">
//                           {doctor.qualification || "N/A"}
//                         </TableCell>
//                         <TableCell className="hidden md:table-cell">
//                           <span
//                             className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                               doctor.status === "Available"
//                                 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
//                                 : doctor.status === "On Leave"
//                                 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
//                                 : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
//                             }`}
//                           >
//                             {doctor.status}
//                           </span>
//                         </TableCell>
                    
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* Pagination */}
//             {filteredDoctors.length > 0 && (
//               <div className="flex w-full items-center justify-between px-2">
//                 <div className="text-sm text-muted-foreground">
//                   Showing <strong>{indexOfFirstItem + 1}</strong> to{" "}
//                   <strong>{Math.min(indexOfLastItem, filteredDoctors.length)}</strong> of{" "}
//                   <strong>{filteredDoctors.length}</strong> doctors
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                   >
//                     Previous
//                   </Button>
//                   <div className="flex items-center">
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                       <Button
//                         key={page}
//                         variant={currentPage === page ? "default" : "outline"}
//                         size="sm"
//                         className="h-8 w-8"
//                         onClick={() => setCurrentPage(page)}
//                       >
//                         {page}
//                       </Button>
//                     ))}
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                   >
//                     Next
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { 
  Search, User, Phone, Calendar, Clock, Building, 
  FileText, BadgeCheck, XCircle, CheckCircle, MoreHorizontal, 
  Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  MapPin, Stethoscope, UserCog, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useGetAllQuery } from "@/app/service/bookings"
import { format, parseISO } from "date-fns"

export function BookingList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [hospitalFilter, setHospitalFilter] = useState("all")
  const [doctorFilter, setDoctorFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Fetch bookings data
  const { data: apiData, isLoading, isError, refetch } = useGetAllQuery();
  
  // Extract bookings from API response
  const bookings = apiData?.data || []
  
  // Get unique hospitals for filter
  const hospitals = ["all", ...new Set(bookings.map(booking => booking?.hospitalId?.name || 'Unknown Hospital'))]
  
  // Get unique doctors for filter
  const doctors = ["all", ...new Set(bookings.map(booking => booking?.doctor_name || 'Unknown Doctor'))]
  
  // Get unique statuses
  const statuses = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "declined", label: "Declined" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ]
  
  // Calculate patient age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "N/A"
    try {
      const birthDate = new Date(dob)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      return age
    } catch (error) {
      return "N/A"
    }
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid Date"
      return format(date, 'dd/MM/yyyy')
    } catch (error) {
      return "N/A"
    }
  }
  
  // Format date for sorting
  const parseDate = (dateString) => {
    if (!dateString) return new Date(0)
    try {
      return parseISO(dateString)
    } catch {
      return new Date(0)
    }
  }
  
  // Sort bookings by creation date (newest first)
  const sortedBookings = [...bookings].sort((a, b) => 
    parseDate(b.createdAt) - parseDate(a.createdAt)
  )
  
  // Filter bookings based on search and filters
  const filteredBookings = sortedBookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      (booking.patient_name?.toLowerCase().includes(searchLower)) ||
      (booking.patient_phone?.includes(searchTerm)) ||
      (booking.doctor_name?.toLowerCase().includes(searchLower)) ||
      (booking.hospitalId?.name?.toLowerCase().includes(searchLower)) ||
      (booking.specialty?.toLowerCase().includes(searchLower)) ||
      (booking.patient_place?.toLowerCase().includes(searchLower))
    
    const matchesStatus = 
      statusFilter === "all" || 
      (booking.status?.toLowerCase() === statusFilter.toLowerCase())
    
    const matchesHospital = 
      hospitalFilter === "all" || 
      (booking.hospitalId?.name === hospitalFilter)
    
    const matchesDoctor = 
      doctorFilter === "all" || 
      (booking.doctor_name === doctorFilter)
    
    return matchesSearch && matchesStatus && matchesHospital && matchesDoctor
  })
  
  // Calculate pagination
  const totalItems = filteredBookings.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem)
  
  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }
    
    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })
    
    return rangeWithDots
  }
  
  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmed
          </Badge>
        )
      case 'declined':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Declined
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case 'completed':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">
            <BadgeCheck className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-gray-300">
            {status || 'Unknown'}
          </Badge>
        )
    }
  }
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setHospitalFilter("all")
    setDoctorFilter("all")
    setCurrentPage(1)
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Hospital Bookings</h2>
            <p className="text-sm text-gray-500 mt-1">Manage all hospital bookings</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading bookings...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Error state
  if (isError) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Hospital Bookings</h2>
            <p className="text-sm text-gray-500 mt-1">Manage all hospital bookings</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-full p-4 w-16 h-16 mx-auto">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
              </div>
              <div>
                <p className="text-destructive font-medium mb-2">Error loading bookings</p>
                <p className="text-sm text-gray-500 mb-4">Please check your connection and try again</p>
                <Button onClick={() => refetch()} className="gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Hospital Bookings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all hospital appointments and bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters}
            className="gap-1"
          >
            Reset Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="gap-1"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2">
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs sm:text-sm text-gray-500">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length}
              </div>
              <p className="text-xs sm:text-sm text-gray-500">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status?.toLowerCase() === 'pending').length}
              </div>
              <p className="text-xs sm:text-sm text-gray-500">Pending</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-600">
                {bookings.filter(b => b.status?.toLowerCase() === 'declined').length}
              </div>
              <p className="text-xs sm:text-sm text-gray-500">Declined</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">Bookings List</CardTitle>
              <CardDescription>
                Showing {filteredBookings.length} of {bookings.length} total bookings
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500 hidden sm:block">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter Section */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings by patient, doctor, hospital, phone, specialty..."
                  className="pl-10 h-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchTerm("")}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Filters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    Status
                  </Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilter(value)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    Hospital
                  </Label>
                  <Select
                    value={hospitalFilter}
                    onValueChange={(value) => {
                      setHospitalFilter(value)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="All Hospitals" />
                    </SelectTrigger>
                    <SelectContent>
                      {hospitals.map((hospital) => (
                        <SelectItem key={hospital} value={hospital}>
                          {hospital}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <Stethoscope className="h-3 w-3" />
                    Doctor
                  </Label>
                  <Select
                    value={doctorFilter}
                    onValueChange={(value) => {
                      setDoctorFilter(value)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="All Doctors" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor} value={doctor}>
                          {doctor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <UserCog className="h-3 w-3" />
                    Items per page
                  </Label>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder={itemsPerPage.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{Math.min(indexOfFirstItem + 1, totalItems)}</span> to{" "}
                <span className="font-semibold">{Math.min(indexOfLastItem, totalItems)}</span> of{" "}
                <span className="font-semibold">{totalItems}</span> results
              </div>
              {filteredBookings.length > 0 && (
                <div className="text-xs text-gray-500">
                  Sorted by: <span className="font-medium">Newest First</span>
                </div>
              )}
            </div>

            {/* Bookings Table */}
            {filteredBookings.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">No bookings found</h3>
                  <p className="text-sm text-gray-400 text-center max-w-md mb-4">
                    {searchTerm || statusFilter !== "all" || hospitalFilter !== "all" || doctorFilter !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "No bookings have been made yet"}
                  </p>
                  {(searchTerm || statusFilter !== "all" || hospitalFilter !== "all" || doctorFilter !== "all") && (
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Clear all filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="font-semibold py-3 min-w-[220px]">
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              Patient Details
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold py-3 min-w-[180px] hidden lg:table-cell">
                            <div className="flex items-center gap-1">
                              <Stethoscope className="h-3.5 w-3.5" />
                              Doctor & Specialty
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold py-3 min-w-[200px]">
                            <div className="flex items-center gap-1">
                              <Building className="h-3.5 w-3.5" />
                              Hospital
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold py-3 min-w-[140px] hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Booking Date
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold py-3 min-w-[120px]">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold py-3 min-w-[140px] hidden xl:table-cell">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              Created
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map((booking) => (
                          <TableRow key={booking._id} className="hover:bg-gray-50 border-b">
                            {/* Patient Details */}
                            <TableCell className="py-3">
                              <div className="space-y-2">
                                <div className="font-medium flex items-start gap-2">
                                  <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <div className="truncate">{booking.patient_name || "Unknown"}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      <span className="inline-flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {booking.patient_phone || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                  <div className="text-gray-600">
                                    Age: <span className="font-medium">{calculateAge(booking.patient_dob)} yrs</span>
                                  </div>
                                  <div className="text-gray-600 truncate" title={booking.patient_place}>
                                    Place: <span className="font-medium truncate">{booking.patient_place || "N/A"}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            
                            {/* Doctor Details */}
                            <TableCell className="py-3 hidden lg:table-cell">
                              <div className="space-y-2">
                                <div className="font-medium truncate" title={booking.doctor_name}>
                                  {booking.doctor_name || "Unknown Doctor"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {booking.specialty || "GENERAL MEDICINE"}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {booking.booking_time || "N/A"}
                                </div>
                              </div>
                            </TableCell>
                            
                            {/* Hospital Details */}
                            <TableCell className="py-3">
                              <div className="space-y-2">
                                <div className="font-medium flex items-start gap-2">
                                  <Building className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <div className="truncate" title={booking.hospitalId?.name}>
                                      {booking.hospitalId?.name || "Unknown Hospital"}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                      <span className="truncate">{booking.hospitalId?.address || "N/A"}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-600">
                                  Phone: <span className="font-medium">{booking.hospitalId?.phone || "N/A"}</span>
                                </div>
                              </div>
                            </TableCell>
                            
                            {/* Booking Date */}
                            <TableCell className="py-3 hidden md:table-cell">
                              <div className="space-y-2">
                                <div className="font-medium">
                                  {formatDate(booking.booking_date)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Time: {booking.booking_time || "N/A"}
                                </div>
                              </div>
                            </TableCell>
                            
                            {/* Status */}
                            <TableCell className="py-3">
                              {getStatusBadge(booking.status)}
                            </TableCell>
                            
                            {/* Created Date */}
                            <TableCell className="py-3 hidden xl:table-cell">
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {formatDate(booking.createdAt)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Created
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-medium">{Math.min(indexOfFirstItem + 1, totalItems)}</span> to{" "}
                      <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span> of{" "}
                      <span className="font-medium">{totalItems}</span> bookings
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {/* First Page */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      
                      {/* Previous Page */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {getPageNumbers().map((pageNum, index) => (
                          pageNum === '...' ? (
                            <span key={`dots-${index}`} className="px-2 text-gray-400">
                              ...
                            </span>
                          ) : (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              className="h-8 w-8"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          )
                        ))}
                      </div>
                      
                      {/* Next Page */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      {/* Last Page */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Page Info */}
                    <div className="text-sm text-gray-600 hidden sm:block">
                      Page <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}