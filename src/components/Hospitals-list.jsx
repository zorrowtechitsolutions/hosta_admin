"use client"

import { useState, useEffect } from "react"
import { 
  Building2, Edit, MoreHorizontal, Plus, Search, Trash, Clock, 
  MapPin, Phone, Mail, Calendar, Star, Stethoscope, User,
  ExternalLink, Eye, AlertCircle, Building, Crosshair, Lock, EyeOff, EyeIcon,
  Upload, X
} from "lucide-react"
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
import { Pagination } from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useAddAHospitalMutation, useDeleteAHospitalMutation, useGetAllHospitalQuery, useRecoveryAHospitalMutation, useUpdateAHospitalMutation } from "@/app/service/hospital"
import { useNavigate } from "react-router-dom"

export function HospitalsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [selectedHospital, setSelectedHospital] = useState(null)
  
  // New hospital state
  const [newHospital, setNewHospital] = useState({
    name: "",
    type: "",
    email: "",
    mobile: "",
    address: "",
    latitude: "",
    longitude: "",
    password: "",
    confirmPassword: "",
  })

  // Editing hospital state
  const [editingHospital, setEditingHospital] = useState({
    _id: "",
    name: "",
    type: "",
    email: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
    working_hours: [],
    hasBreakSchedule: false
  })

  // Working hours states for add
  const [activeTab, setActiveTab] = useState('normal')
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Normal Hospital Working Hours
  const [workingHours, setWorkingHours] = useState({
    Monday: { open: '09:00', close: '18:00', isHoliday: false },
    Tuesday: { open: '09:00', close: '18:00', isHoliday: false },
    Wednesday: { open: '09:00', close: '18:00', isHoliday: false },
    Thursday: { open: '09:00', close: '18:00', isHoliday: false },
    Friday: { open: '09:00', close: '18:00', isHoliday: false },
    Saturday: { open: '09:00', close: '18:00', isHoliday: false },
    Sunday: { open: '', close: '', isHoliday: true },
  })

  // Clinic Working Hours with morning and evening sessions
  const [workingHoursClinic, setWorkingHoursClinic] = useState({
    Monday: {
      morning_session: { open: '09:00', close: '12:00' },
      evening_session: { open: '16:00', close: '20:00' },
      isHoliday: false,
      hasBreak: true,
    },
    Tuesday: {
      morning_session: { open: '09:00', close: '12:00' },
      evening_session: { open: '16:00', close: '20:00' },
      isHoliday: false,
      hasBreak: true,
    },
    Wednesday: {
      morning_session: { open: '09:00', close: '12:00' },
      evening_session: { open: '16:00', close: '20:00' },
      isHoliday: false,
      hasBreak: true,
    },
    Thursday: {
      morning_session: { open: '09:00', close: '12:00' },
      evening_session: { open: '16:00', close: '20:00' },
      isHoliday: false,
      hasBreak: true,
    },
    Friday: {
      morning_session: { open: '09:00', close: '12:00' },
      evening_session: { open: '16:00', close: '20:00' },
      isHoliday: false,
      hasBreak: true,
    },
    Saturday: {
      morning_session: { open: '09:00', close: '12:00' },
      evening_session: { open: '16:00', close: '18:00' },
      isHoliday: false,
      hasBreak: true,
    },
    Sunday: {
      morning_session: { open: '', close: '' },
      evening_session: { open: '', close: '' },
      isHoliday: true,
      hasBreak: false,
    },
  })

  // Working hours states for edit dialog
  const [editActiveTab, setEditActiveTab] = useState('normal')
  const [editWorkingHours, setEditWorkingHours] = useState({})
  const [editWorkingHoursClinic, setEditWorkingHoursClinic] = useState({})
  
  // Image state for edit
  const [editImage, setEditImage] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Fetch data
  const { data: apiData, isLoading, isError, refetch } = useGetAllHospitalQuery();
  
  // Mutations
  const [addAHospital, { isLoading: isAdding }] = useAddAHospitalMutation()
  const [deleteAHospital, { isLoading: isDeleting }] = useDeleteAHospitalMutation()
  const [updateAHospital, { isLoading: isUpdating }] = useUpdateAHospitalMutation()
  const [recoveryAHospital, { isLoading: isRecovery }] = useRecoveryAHospitalMutation()

  // Get hospitals from API data
  const hospitals = apiData?.data || []

  // Filter hospitals
  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch =
      hospital.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.type?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || hospital.type === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredHospitals.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage)

  // Helper functions
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0)
    return (sum / reviews.length).toFixed(1)
  }

  // Handle input changes
  const handleNewHospitalChange = (e) => {
    const { name, value } = e.target
    setNewHospital((prev) => ({
      ...prev,
      [name]: name === 'name' ? value.toUpperCase() : 
              name === 'email' ? value.toLowerCase() : value
    }))
  }

  const handleEditHospitalChange = (e) => {
    const { name, value } = e.target
    setEditingHospital((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Working hours handlers for add dialog
  const handleWorkingHoursChange = (day, type, value) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value }
    }))
  }

  const handleClinicHoursChange = (day, field, value) => {
    setWorkingHoursClinic((prev) => {
      const updatedDay = { ...prev[day] }
      if (field === 'isHoliday') {
        updatedDay.isHoliday = value
      } else if (field === 'hasBreak') {
        updatedDay.hasBreak = value
      } else if (field.includes('morning_session')) {
        const sessionField = field.split('.')[1]
        updatedDay.morning_session = {
          ...updatedDay.morning_session,
          [sessionField]: value
        }
      } else if (field.includes('evening_session')) {
        const sessionField = field.split('.')[1]
        updatedDay.evening_session = {
          ...updatedDay.evening_session,
          [sessionField]: value
        }
      }
      return { ...prev, [day]: updatedDay }
    })
  }

  // Working hours handlers for edit dialog
  const handleEditWorkingHoursChange = (day, type, value) => {
    setEditWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value }
    }))
  }

  const handleEditClinicHoursChange = (day, field, value) => {
    setEditWorkingHoursClinic((prev) => {
      const updatedDay = { ...prev[day] }
      if (field === 'isHoliday') {
        updatedDay.isHoliday = value
      } else if (field === 'hasBreak') {
        updatedDay.hasBreak = value
      } else if (field.includes('morning_session')) {
        const sessionField = field.split('.')[1]
        updatedDay.morning_session = {
          ...updatedDay.morning_session,
          [sessionField]: value
        }
      } else if (field.includes('evening_session')) {
        const sessionField = field.split('.')[1]
        updatedDay.evening_session = {
          ...updatedDay.evening_session,
          [sessionField]: value
        }
      }
      return { ...prev, [day]: updatedDay }
    })
  }

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewHospital((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }))
          setIsGettingLocation(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('Unable to get your location. Please enter manually.')
          setIsGettingLocation(false)
        }
      )
    } else {
      toast.warning('Geolocation is not supported by your browser!')
      setIsGettingLocation(false)
    }
  }

  // Fill 24 hour times
  const fill24HourTimes = () => {
    if (activeTab === 'normal') {
      const updated24HourTimes = Object.keys(workingHours).reduce((acc, day) => {
        acc[day] = { open: '00:00', close: '23:59', isHoliday: false }
        return acc
      }, {})
      setWorkingHours(updated24HourTimes)
    } else {
      const updated24HourTimes = Object.keys(workingHoursClinic).reduce((acc, day) => {
        acc[day] = {
          morning_session: { open: '00:00', close: '23:59' },
          evening_session: { open: '00:00', close: '23:59' },
          isHoliday: false,
          hasBreak: false,
        }
        return acc
      }, {})
      setWorkingHoursClinic(updated24HourTimes)
    }
  }

  const fillEdit24HourTimes = () => {
    if (editActiveTab === 'normal') {
      const updated24HourTimes = Object.keys(editWorkingHours).reduce((acc, day) => {
        acc[day] = { open: '00:00', close: '23:59', isHoliday: false }
        return acc
      }, {})
      setEditWorkingHours(updated24HourTimes)
    } else {
      const updated24HourTimes = Object.keys(editWorkingHoursClinic).reduce((acc, day) => {
        acc[day] = {
          morning_session: { open: '00:00', close: '23:59' },
          evening_session: { open: '00:00', close: '23:59' },
          isHoliday: false,
          hasBreak: false,
        }
        return acc
      }, {})
      setEditWorkingHoursClinic(updated24HourTimes)
    }
  }

  // Reset forms
  const resetNewHospitalForm = () => {
    setNewHospital({
      name: "",
      type: "",
      email: "",
      mobile: "",
      address: "",
      latitude: "",
      longitude: "",
      password: "",
      confirmPassword: "",
    })
    setWorkingHours({
      Monday: { open: '09:00', close: '18:00', isHoliday: false },
      Tuesday: { open: '09:00', close: '18:00', isHoliday: false },
      Wednesday: { open: '09:00', close: '18:00', isHoliday: false },
      Thursday: { open: '09:00', close: '18:00', isHoliday: false },
      Friday: { open: '09:00', close: '18:00', isHoliday: false },
      Saturday: { open: '09:00', close: '18:00', isHoliday: false },
      Sunday: { open: '', close: '', isHoliday: true },
    })
    setWorkingHoursClinic({
      Monday: {
        morning_session: { open: '09:00', close: '12:00' },
        evening_session: { open: '16:00', close: '20:00' },
        isHoliday: false,
        hasBreak: true,
      },
      Tuesday: {
        morning_session: { open: '09:00', close: '12:00' },
        evening_session: { open: '16:00', close: '20:00' },
        isHoliday: false,
        hasBreak: true,
      },
      Wednesday: {
        morning_session: { open: '09:00', close: '12:00' },
        evening_session: { open: '16:00', close: '20:00' },
        isHoliday: false,
        hasBreak: true,
      },
      Thursday: {
        morning_session: { open: '09:00', close: '12:00' },
        evening_session: { open: '16:00', close: '20:00' },
        isHoliday: false,
        hasBreak: true,
      },
      Friday: {
        morning_session: { open: '09:00', close: '12:00' },
        evening_session: { open: '16:00', close: '20:00' },
        isHoliday: false,
        hasBreak: true,
      },
      Saturday: {
        morning_session: { open: '09:00', close: '12:00' },
        evening_session: { open: '16:00', close: '18:00' },
        isHoliday: false,
        hasBreak: true,
      },
      Sunday: {
        morning_session: { open: '', close: '' },
        evening_session: { open: '', close: '' },
        isHoliday: true,
        hasBreak: false,
      },
    })
    setActiveTab('normal')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  // Validation
  const validateNewHospital = () => {
    const errors = {}
    
    if (!newHospital.name.trim()) errors.name = 'Hospital name is required'
    if (!newHospital.type) errors.type = 'Hospital type is required'
    if (!newHospital.email) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(newHospital.email)) errors.email = 'Email is invalid'
    if (!newHospital.mobile) errors.mobile = 'Mobile number is required'
    else if (!/^\d{10}$/.test(newHospital.mobile)) errors.mobile = 'Mobile number must be 10 digits'
    if (!newHospital.address) errors.address = 'Address is required'
    if (!newHospital.latitude) errors.latitude = 'Latitude is required'
    if (!newHospital.longitude) errors.longitude = 'Longitude is required'
    if (!newHospital.password) errors.password = 'Password is required'
    else if (newHospital.password.length < 8) errors.password = 'Password must be at least 8 characters'
    if (newHospital.password !== newHospital.confirmPassword) errors.confirmPassword = 'Passwords do not match'

    return errors
  }

  const validateWorkingHours = () => {
    if (activeTab === 'normal') {
      const hasValidHours = Object.values(workingHours).some(hours => 
        !hours.isHoliday && hours.open && hours.close
      )
      if (!hasValidHours) {
        toast.error("Please set working hours for at least one day")
        return false
      }
    } else {
      const hasValidHours = Object.values(workingHoursClinic).some(hours => 
        !hours.isHoliday && 
        hours.morning_session.open && hours.morning_session.close &&
        hours.evening_session.open && hours.evening_session.close
      )
      if (!hasValidHours) {
        toast.error("Please set working hours for at least one day")
        return false
      }
    }
    return true
  }

  // Handle image upload for edit
  const handleEditImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB")
        return
      }
      
      setEditImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeEditImage = () => {
    setEditImage(null)
    setEditImagePreview("")
  }

  const handleAddHospital = async () => {
    // 🔹 Validate
    const errors = validateNewHospital()
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => toast.error(error))
      return
    }

    // 🔹 Validate working hours
    if (!validateWorkingHours()) return

    try {
      // 🔹 Prepare working hours
      let formattedWorkingHours = []
      let formattedWorkingHoursClinic = []

      if (activeTab === 'normal') {
        formattedWorkingHours = Object.entries(workingHours).map(([day, hours]) => ({
          day,
          opening_time: hours.isHoliday ? "" : hours.open,
          closing_time: hours.isHoliday ? "" : hours.close,
          is_holiday: hours.isHoliday,
        }))
      } else {
        formattedWorkingHoursClinic = Object.entries(workingHoursClinic).map(([day, hours]) => ({
          day,
          morning_session: {
            open: hours.isHoliday ? "" : hours.morning_session.open,
            close: hours.isHoliday ? "" : hours.morning_session.close
          },
          evening_session: {
            open: hours.isHoliday ? "" : hours.evening_session.open,
            close: hours.isHoliday ? "" : hours.evening_session.close
          },
          is_holiday: hours.isHoliday,
          has_break: hours.hasBreak
        }))
      }

      // 🔹 Build request data
      const requestData = {
        name: newHospital.name,
        type: newHospital.type,
        email: newHospital.email,
        phone: newHospital.mobile, // Changed from 'mobile' to 'phone'
        address: newHospital.address,
        latitude: newHospital.latitude,
        longitude: newHospital.longitude,
        password: newHospital.password,
        hasBreakSchedule: activeTab === "clinic",
        workingHours: activeTab === "normal" ? formattedWorkingHours : [],
        workingHoursClinic: activeTab === "clinic" ? formattedWorkingHoursClinic : []
      }

      console.log("Sending hospital data:", requestData)

      // 🔹 Send to API
      const result = await addAHospital({ data: requestData }).unwrap()

      if (result?.status === 200) {
        toast.success("Hospital added successfully!")
        setIsAddDialogOpen(false)
        resetNewHospitalForm()
        refetch()
      } else {
        toast.error(result?.message || "Failed to add hospital")
      }
    } 
    catch (error) {
      console.error("Add hospital error:", error)
      toast.error(error?.data?.message || "Server error!")
    }
  }

  // UPDATE HOSPITAL with image upload
  const handleEditHospital = async () => {
    try {
      if (!editingHospital._id) return

      // Prepare working hours based on edit active tab
      let workingHoursData = []
      if (editActiveTab === 'normal') {
        workingHoursData = Object.entries(editWorkingHours).map(([day, hours]) => ({
          day,
          opening_time: hours.isHoliday ? "" : hours.open,
          closing_time: hours.isHoliday ? "" : hours.close,
          is_holiday: hours.isHoliday
        }))
      } else {
        workingHoursData = Object.entries(editWorkingHoursClinic).map(([day, hours]) => ({
          day,
          morning_session: {
            open: hours.isHoliday ? "" : hours.morning_session.open,
            close: hours.isHoliday ? "" : hours.morning_session.close
          },
          evening_session: {
            open: hours.isHoliday ? "" : hours.evening_session.open,
            close: hours.isHoliday ? "" : hours.evening_session.close
          },
          is_holiday: hours.isHoliday,
          has_break: hours.hasBreak
        }))
      }

      // Create FormData
      const formData = new FormData()
      
      // Append basic data
      formData.append('name', editingHospital.name)
      formData.append('type', editingHospital.type)
      formData.append('email', editingHospital.email)
      formData.append('phone', editingHospital.phone)
      formData.append('address', editingHospital.address)
      formData.append('latitude', editingHospital.latitude || '')
      formData.append('longitude', editingHospital.longitude || '')
      formData.append('hasBreakSchedule', editActiveTab === 'clinic' ? 'true' : 'false')
      formData.append('working_hours', JSON.stringify(workingHoursData))
      
      // Append image if selected
      if (editImage) {
        formData.append('image', editImage)
      }

      console.log("Updating hospital with FormData:", {
        name: editingHospital.name,
        type: editingHospital.type,
        email: editingHospital.email,
        phone: editingHospital.phone,
        address: editingHospital.address,
        latitude: editingHospital.latitude,
        longitude: editingHospital.longitude,
        hasBreakSchedule: editActiveTab === 'clinic',
        working_hours: workingHoursData,
        hasImage: !!editImage
      })

      setIsUploadingImage(true)
      const result = await updateAHospital({
        id: editingHospital._id,
        data: formData
      }).unwrap()

        toast.success("Hospital updated successfully")
        setIsEditDialogOpen(false)
        setEditingHospital({
          _id: "",
          name: "",
          type: "",
          email: "",
          phone: "",
          address: "",
          latitude: "",
          longitude: "",
          working_hours: [],
          hasBreakSchedule: false
        })
        setEditImage(null)
        setEditImagePreview("")
        refetch()
  
    } catch (error) {
      console.error('Update hospital error:', error)
      toast.error(error?.data?.message || "Failed to update hospital")
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Load hospital data into edit form
  const openEditDialog = (hospital) => {
    
    setEditingHospital({
      _id: hospital._id,
      name: hospital.name || "",
      type: hospital.type || "",
      email: hospital.email || "",
      phone: hospital.phone || "",
      address: hospital.address || "",
      latitude: hospital.latitude || "",
      longitude: hospital.longitude || "",
      working_hours: hospital.working_hours || [],
      hasBreakSchedule: false
    })

    // Set image preview if exists
    if (hospital.image?.imageUrl) {
      setEditImagePreview(hospital.image.imageUrl)
    } else {
      setEditImagePreview("")
    }
    setEditImage(null)

    // Determine if it's a clinic or normal hospital
    const isClinic = hospital.hasBreakSchedule || 
                    (hospital.working_hours && hospital.working_hours.some(day => day.morning_session || day.evening_session))
    
    setEditActiveTab(isClinic ? 'clinic' : 'normal')

    // Reset working hours states
    setEditWorkingHours({})
    setEditWorkingHoursClinic({})

    // Convert API working hours to form state
    if (hospital.working_hours && hospital.working_hours.length > 0) {
      if (isClinic) {
        const clinicHours = {}
        hospital.working_hours.forEach(day => {
          clinicHours[day.day] = {
            morning_session: {
              open: day.morning_session?.open || '09:00',
              close: day.morning_session?.close || '12:00'
            },
            evening_session: {
              open: day.evening_session?.open || '16:00',
              close: day.evening_session?.close || '20:00'
            },
            isHoliday: day.is_holiday || false,
            hasBreak: day.has_break || true
          }
        })
        setEditWorkingHoursClinic(clinicHours)
      } else {
        const normalHours = {}
        hospital.working_hours.forEach(day => {
          normalHours[day.day] = {
            open: day.opening_time || '09:00',
            close: day.closing_time || '18:00',
            isHoliday: day.is_holiday || false
          }
        })
        setEditWorkingHours(normalHours)
      }
    } else {
      // Set defaults if no working hours
      if (isClinic) {
        setEditWorkingHoursClinic({
          Monday: {
            morning_session: { open: '09:00', close: '12:00' },
            evening_session: { open: '16:00', close: '20:00' },
            isHoliday: false,
            hasBreak: true,
          },
          Tuesday: {
            morning_session: { open: '09:00', close: '12:00' },
            evening_session: { open: '16:00', close: '20:00' },
            isHoliday: false,
            hasBreak: true,
          },
          Wednesday: {
            morning_session: { open: '09:00', close: '12:00' },
            evening_session: { open: '16:00', close: '20:00' },
            isHoliday: false,
            hasBreak: true,
          },
          Thursday: {
            morning_session: { open: '09:00', close: '12:00' },
            evening_session: { open: '16:00', close: '20:00' },
            isHoliday: false,
            hasBreak: true,
          },
          Friday: {
            morning_session: { open: '09:00', close: '12:00' },
            evening_session: { open: '16:00', close: '20:00' },
            isHoliday: false,
            hasBreak: true,
          },
          Saturday: {
            morning_session: { open: '09:00', close: '12:00' },
            evening_session: { open: '16:00', close: '18:00' },
            isHoliday: false,
            hasBreak: true,
          },
          Sunday: {
            morning_session: { open: '', close: '' },
            evening_session: { open: '', close: '' },
            isHoliday: true,
            hasBreak: false,
          },
        })
      } else {
        setEditWorkingHours({
          Monday: { open: '09:00', close: '18:00', isHoliday: false },
          Tuesday: { open: '09:00', close: '18:00', isHoliday: false },
          Wednesday: { open: '09:00', close: '18:00', isHoliday: false },
          Thursday: { open: '09:00', close: '18:00', isHoliday: false },
          Friday: { open: '09:00', close: '18:00', isHoliday: false },
          Saturday: { open: '09:00', close: '18:00', isHoliday: false },
          Sunday: { open: '', close: '', isHoliday: true },
        })
      }
    }

    setIsEditDialogOpen(true)
  }

  // Delete and Recovery functions
  const handleDeleteHospital = async (hospitalId, hospitalName) => {
    if (!confirm(`Are you sure you want to delete ${hospitalName}?`)) return

    try {
      const result = await deleteAHospital(hospitalId).unwrap()
      
      if (result.status == 200) {
        toast.success(`${hospitalName} has been deleted`)
        refetch()
      } else {
        toast.error(result.message || "Failed to delete hospital")
      }
    } catch (error) {
      console.error('Delete hospital error:', error)
      toast.error(error?.data?.message || "Failed to delete hospital")
    }
  }

  const handleRecoveryHospital = async (hospitalId, hospitalName) => {
    try {
      const result = await recoveryAHospital(hospitalId).unwrap()
      if (result.status == 200) {
        toast.success(`${hospitalName} has been recovered`)
        refetch()
      } else {
        toast.error(result.message || "Failed to recover hospital")
      }
    } catch (error) {
      console.error('Recovery hospital error:', error)
      toast.error(error?.data?.message || "Failed to recover hospital")
    }
  }

  const openViewDialog = (hospital) => {
    setSelectedHospital(hospital)
    setIsViewDialogOpen(true)
  }

  // Render working hours components
  const renderNormalWorkingHours = (hours, onChange, isEdit = false) => (
    <div className="space-y-3">
      {Object.entries(hours).map(([day, dayHours]) => (
        <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
          <div className="w-full sm:w-24">
            <span className="text-sm font-medium text-green-700">{day}</span>
          </div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Open Time */}
            <div className="relative">
              <label className="block text-xs text-green-600 mb-1 sm:sr-only">Open Time</label>
              <Input
                type="time"
                value={dayHours.open}
                onChange={(e) => onChange(day, 'open', e.target.value)}
                className="w-full text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={dayHours.isHoliday}
              />
            </div>

            {/* Close Time */}
            <div className="relative">
              <label className="block text-xs text-green-600 mb-1 sm:sr-only">Close Time</label>
              <Input
                type="time"
                value={dayHours.close}
                onChange={(e) => onChange(day, 'close', e.target.value)}
                className="w-full text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={dayHours.isHoliday}
              />
            </div>

            {/* Holiday Checkbox */}
            <div className="flex items-center justify-start sm:justify-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dayHours.isHoliday}
                  onChange={(e) => onChange(day, 'isHoliday', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-green-700 select-none">Holiday</span>
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderClinicWorkingHours = (hours, onChange, isEdit = false) => (
    <div className="space-y-4">
      {Object.entries(hours).map(([day, dayHours]) => (
        <div key={day} className="p-4 border border-green-200 rounded-lg bg-green-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <span className="text-sm font-medium text-green-700">{day}</span>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dayHours.isHoliday}
                  onChange={(e) => onChange(day, 'isHoliday', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-green-700 select-none">Holiday</span>
              </label>
            </div>
          </div>

          {!dayHours.isHoliday && (
            <div className="space-y-4">
              {/* Morning Session */}
              <div>
                <h4 className="text-xs font-medium text-green-600 mb-2">Morning Session</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-green-500 mb-1">Open Time</label>
                    <Input
                      type="time"
                      value={dayHours.morning_session.open}
                      onChange={(e) => onChange(day, 'morning_session.open', e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-green-500 mb-1">Close Time</label>
                    <Input
                      type="time"
                      value={dayHours.morning_session.close}
                      onChange={(e) => onChange(day, 'morning_session.close', e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Evening Session */}
              <div>
                <h4 className="text-xs font-medium text-green-600 mb-2">Evening Session</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-green-500 mb-1">Open Time</label>
                    <Input
                      type="time"
                      value={dayHours.evening_session.open}
                      onChange={(e) => onChange(day, 'evening_session.open', e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-green-500 mb-1">Close Time</label>
                    <Input
                      type="time"
                      value={dayHours.evening_session.close}
                      onChange={(e) => onChange(day, 'evening_session.close', e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Break Schedule */}
              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dayHours.hasBreak}
                    onChange={(e) => onChange(day, 'hasBreak', e.target.checked)}
                    className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-green-700 select-none">Has Break Between Sessions</span>
                </label>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderHospitalStatus = (hospital) => {
    if (hospital.deleteRequested && hospital.deleteDate) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
          Pending Deletion
        </Badge>
      )
    } else if (hospital.deleteRequested) {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
          Delete Requested
        </Badge>
      )
    }
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    )
  }

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Hospitals</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading hospitals...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Hospitals</h2>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.196 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Data</h3>
              <p className="text-red-600 mb-4">Failed to load hospitals. Please try again.</p>
              <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Hospitals</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all registered hospitals</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">Hospitals List</CardTitle>
            <CardDescription>
              Showing {filteredHospitals.length} of {hospitals.length} total hospitals
            </CardDescription>
          </div>
          
          {/* Add Hospital Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (!open) resetNewHospitalForm()
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1 w-full sm:w-auto">
                <Plus className="h-4 w-4" /> Add Hospital
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Hospital</DialogTitle>
                <DialogDescription>Enter the details of the new hospital here.</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Hospital Name *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="name"
                        name="name"
                        value={newHospital.name}
                        onChange={handleNewHospitalChange}
                        placeholder="Enter hospital name"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Hospital Type *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Select
                        name="type"
                        value={newHospital.type}
                        onValueChange={(value) => setNewHospital({ ...newHospital, type: value })}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select hospital type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Allopathy">Allopathy</SelectItem>
                          <SelectItem value="Homeopathy">Homeopathy</SelectItem>
                          <SelectItem value="Ayurveda">Ayurveda</SelectItem>
                          <SelectItem value="Unani">Unani</SelectItem>
                          <SelectItem value="Physiotherapy">Physiotherapy</SelectItem>
                          <SelectItem value="Mental Health">Mental Health</SelectItem>
                          <SelectItem value="Laboratory">Laboratory</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={newHospital.email}
                        onChange={handleNewHospitalChange}
                        placeholder="Enter email address"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={newHospital.mobile}
                        onChange={handleNewHospitalChange}
                        placeholder="Enter mobile number"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                      <textarea
                        id="address"
                        name="address"
                        value={newHospital.address}
                        onChange={handleNewHospitalChange}
                        className="pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                        placeholder="Enter hospital address"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          type="text"
                          id="latitude"
                          name="latitude"
                          value={newHospital.latitude}
                          onChange={handleNewHospitalChange}
                          placeholder="Enter latitude"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          type="text"
                          id="longitude"
                          name="longitude"
                          value={newHospital.longitude}
                          onChange={handleNewHospitalChange}
                          placeholder="Enter longitude"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    variant="outline"
                    className="w-full"
                  >
                    {isGettingLocation ? (
                      "Getting Location..."
                    ) : (
                      <>
                        <Crosshair className="mr-2" size={18} />
                        Get Current Location
                      </>
                    )}
                  </Button>
                </div>

                {/* Working Hours Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <Label className="text-lg font-semibold">
                      Working Hours
                    </Label>
                    <Button
                      onClick={fill24HourTimes}
                      variant="outline"
                      type="button"
                      className="w-full sm:w-auto"
                    >
                      Set 24/7 Hours
                    </Button>
                  </div>

                  <div className="mb-6">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                      <button
                        type="button"
                        className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                          activeTab === 'normal'
                            ? 'border-b-2 border-green-600 text-green-600 bg-green-100'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveTab('normal')}
                      >
                        <Building size={16} className="mr-2" />
                        Normal Hospital
                      </button>
                      <button
                        type="button"
                        className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                          activeTab === 'clinic'
                            ? 'border-b-2 border-green-600 text-green-600 bg-green-100'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveTab('clinic')}
                      >
                        <Building size={16} className="mr-2" />
                        Clinic
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {activeTab === 'normal' 
                      ? renderNormalWorkingHours(workingHours, handleWorkingHoursChange)
                      : renderClinicWorkingHours(workingHoursClinic, handleClinicHoursChange)
                    }
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={newHospital.password}
                        onChange={handleNewHospitalChange}
                        placeholder="Enter password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={newHospital.confirmPassword}
                        onChange={handleNewHospitalChange}
                        placeholder="Confirm password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleAddHospital} disabled={isAdding} className="w-full sm:w-auto">
                  {isAdding ? "Adding..." : "Add Hospital"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Search and Filter - Responsive */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hospitals..."
                  className="h-9 flex-1"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Allopathy">Allopathy</SelectItem>
                  <SelectItem value="Homeopathy">Homeopathy</SelectItem>
                  <SelectItem value="Ayurveda">Ayurveda</SelectItem>
                  <SelectItem value="Unani">Unani</SelectItem>
                  <SelectItem value="Physiotherapy">Physiotherapy</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Hospital</TableHead>
                      <TableHead className="hidden sm:table-cell">Type</TableHead>
                      <TableHead className="hidden lg:table-cell">Contact</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden xl:table-cell">Reviews</TableHead>
                      <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center py-8">
                            <Building2 className="h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500">No hospitals found</p>
                            <p className="text-gray-400 text-sm mt-1">
                              Try adjusting your search or filter
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentItems.map((hospital) => (
                        <TableRow 
                          key={hospital._id}
                          className="hover:bg-gray-50 cursor-pointer"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3" onClick={() => openViewDialog(hospital)}>
                              <Avatar className="h-10 w-10 border">
                                <AvatarImage src={hospital.image?.imageUrl} />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {hospital.name?.charAt(0) || 'H'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="font-medium flex items-center gap-2 truncate">
                                  {hospital.name}
                                  <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-1 truncate">
                                  <MapPin className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">
                                    {hospital.address || 'No address'}
                                  </span>
                                </div>
                            </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline" className="font-normal">
                              {hospital.type || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-1 text-sm truncate">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{hospital.phone || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500 truncate">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{hospital.email || 'N/A'}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {renderHospitalStatus(hospital)}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">
                                  {calculateAverageRating(hospital.reviews)}
                                </span>
                              </div>
                              <span className="text-gray-500 text-sm">
                                ({hospital.reviews?.length || 0})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigate(`/hospitals/doctors/${hospital._id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Doctors
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(hospital)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {hospital.deleteRequested ? (
                                  <DropdownMenuItem
                                    onClick={() => handleRecoveryHospital(hospital._id, hospital.name)}
                                    className="text-green-600"
                                  >
                                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                    Recover
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteHospital(hospital._id, hospital.name)}
                                    className="text-red-600"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            {filteredHospitals.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{indexOfFirstItem + 1}</strong> to{" "}
                  <strong>{Math.min(indexOfLastItem, filteredHospitals.length)}</strong> of{" "}
                  <strong>{filteredHospitals.length}</strong> results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                      
                      if (pageNum < 1 || pageNum > totalPages) return null
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Hospital Dialog with Image Upload - FIXED FILE INPUT */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hospital</DialogTitle>
            <DialogDescription>Update the hospital details.</DialogDescription>
          </DialogHeader>
          
          {editingHospital && (
            <div className="space-y-6">
              {/* Image Upload Section - FIXED */}
              <div className="space-y-4">
                <Label>Hospital Image</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {editImagePreview ? (
                    <div className="relative w-full max-w-xs">
                      <img 
                        src={editImagePreview} 
                        alt="Hospital preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={removeEditImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 mb-2">Upload hospital image</p>
                      <div className="flex flex-col items-center gap-2">
                        <Input
                          id="edit-image-upload"
                          type="file"
                          accept="image/*"
                          className="w-full max-w-xs"
                          onChange={handleEditImageChange}
                        />
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Hospital Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editingHospital.name}
                    onChange={handleEditHospitalChange}
                    placeholder="Enter hospital name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Hospital Type</Label>
                  <Select
                    name="type"
                    value={editingHospital.type}
                    onValueChange={(value) => setEditingHospital({ ...editingHospital, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Allopathy">Allopathy</SelectItem>
                      <SelectItem value="Homeopathy">Homeopathy</SelectItem>
                      <SelectItem value="Ayurveda">Ayurveda</SelectItem>
                      <SelectItem value="Unani">Unani</SelectItem>
                      <SelectItem value="Physiotherapy">Physiotherapy</SelectItem>
                      <SelectItem value="Laboratory">Laboratory</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={editingHospital.email}
                    onChange={handleEditHospitalChange}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    value={editingHospital.phone}
                    onChange={handleEditHospitalChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <textarea
                  id="edit-address"
                  name="address"
                  value={editingHospital.address || ''}
                  onChange={handleEditHospitalChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                  placeholder="Enter hospital address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-latitude">Latitude</Label>
                  <Input
                    id="edit-latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={editingHospital.latitude || ''}
                    onChange={handleEditHospitalChange}
                    placeholder="Enter latitude"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-longitude">Longitude</Label>
                  <Input
                    id="edit-longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={editingHospital.longitude || ''}
                    onChange={handleEditHospitalChange}
                    placeholder="Enter longitude"
                  />
                </div>
              </div>

              {/* Working Hours Section for Edit */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                  <Label className="text-lg font-semibold">
                    Working Hours
                  </Label>
                  <Button
                    onClick={fillEdit24HourTimes}
                    variant="outline"
                    type="button"
                    className="w-full sm:w-auto"
                  >
                    Set 24/7 Hours
                  </Button>
                </div>

                <div className="mb-6">
                  <div className="flex border-b border-gray-200 overflow-x-auto">
                    <button
                      type="button"
                      className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                        editActiveTab === 'normal'
                          ? 'border-b-2 border-green-600 text-green-600 bg-green-100'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setEditActiveTab('normal')}
                    >
                      <Building size={16} className="mr-2" />
                      Normal Hospital
                    </button>
                    <button
                      type="button"
                      className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                        editActiveTab === 'clinic'
                          ? 'border-b-2 border-green-600 text-green-600 bg-green-100'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setEditActiveTab('clinic')}
                    >
                      <Building size={16} className="mr-2" />
                      Clinic
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  {editActiveTab === 'normal' 
                    ? renderNormalWorkingHours(editWorkingHours, handleEditWorkingHoursChange, true)
                    : renderClinicWorkingHours(editWorkingHoursClinic, handleEditClinicHoursChange, true)
                  }
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              onClick={handleEditHospital} 
              disabled={isUpdating || isUploadingImage}
              className="w-full sm:w-auto"
            >
              {isUpdating || isUploadingImage ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Hospital Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Hospital Details</DialogTitle>
            <DialogDescription>
              Complete information about the hospital
            </DialogDescription>
          </DialogHeader>
          {selectedHospital && (
            <div className="space-y-6 py-4">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                    <img 
                      src={selectedHospital.image?.imageUrl} 
                      alt={selectedHospital.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedHospital.name)}&background=3b82f6&color=ffffff&size=128`
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedHospital.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <Badge variant="secondary" className="text-lg py-1 px-3">
                      {selectedHospital.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">
                        {calculateAverageRating(selectedHospital.reviews)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({selectedHospital.reviews?.length || 0} reviews)
                      </span>
                    </div>
                    {renderHospitalStatus(selectedHospital)}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedHospital.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedHospital.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{selectedHospital.address || 'Not set'}</p>
                        {selectedHospital.latitude && selectedHospital.longitude && (
                          <p className="text-xs text-gray-400 mt-1">
                            Coordinates: {selectedHospital.latitude}, {selectedHospital.longitude}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Working Hours
                </h4>
                {selectedHospital.working_hours && selectedHospital.working_hours.length > 0 ? (
                  <div className="space-y-2">
                    {selectedHospital.working_hours.map((day, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 last:border-b-0 gap-2">
                        <span className="font-medium w-28">{day.day}</span>
                        {day.is_holiday ? (
                          <Badge variant="outline" className="text-red-600 border-red-200 w-full sm:w-auto">
                            Closed
                          </Badge>
                        ) : day.morning_session && day.evening_session ? (
                          <div className="text-sm text-left sm:text-right">
                            <div>Morning: {day.morning_session.open} - {day.morning_session.close}</div>
                            <div>Evening: {day.evening_session.open} - {day.evening_session.close}</div>
                          </div>
                        ) : (
                          <span className="font-medium">
                            {day.opening_time || 'N/A'} - {day.closing_time || 'N/A'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Working hours not set</p>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Specialties & Services
                </h4>
                {selectedHospital.specialties && selectedHospital.specialties.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                        {specialty.name || specialty}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No specialties added</p>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="text-lg font-semibold mb-4">Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-700">
                      {selectedHospital.reviews?.length || 0}
                    </p>
                    <p className="text-sm text-blue-600">Reviews</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-700">
                      {selectedHospital.specialties?.length || 0}
                    </p>
                    <p className="text-sm text-green-600">Specialties</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-700">
                      {selectedHospital.working_hours?.filter(day => !day.is_holiday).length || 0}
                    </p>
                    <p className="text-sm text-purple-600">Working Days</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-amber-700">
                      {selectedHospital.autoDeclineMinutes || 5}
                    </p>
                    <p className="text-sm text-amber-600">Auto Decline (min)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
            {selectedHospital && (
              <Button 
                onClick={() => {
                  setIsViewDialogOpen(false)
                  openEditDialog(selectedHospital)
                }}
                className="w-full sm:w-auto"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Hospital
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}