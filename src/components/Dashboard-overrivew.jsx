"use client"


import { useEffect, useState } from "react"
import { Ambulance, Building2, Droplets, Stethoscope } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "./Dashboard-status"
import { RecentActivities } from "./Recent-activities"
import { useGetAllDoctorsQuery } from "@/app/service/doctors"
import { useGetAllAmbulanceQuery } from "@/app/service/ambulance"
import { useGetAllBloodQuery } from "@/app/service/blood"

export function DashboardOverview() {
  const [mounted, setMounted] = useState(false)
    const [allDoctors, setAllDoctors] = useState([])

    const { data: apiData } = useGetAllDoctorsQuery()
      const { data : ambulanceData} = useGetAllAmbulanceQuery();
    const { data : bloodData } = useGetAllBloodQuery();
          
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

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Hospitals"
          value={apiData?.hospitals?.length}
          description="+4 this month"
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Total Doctors"
          value={allDoctors?.length}
          description="+12 this month"
          icon={<Stethoscope className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Ambulances"
          value={ambulanceData?.data?.length}
          description="+2 this month"
          icon={<Ambulance className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Blood Donors"
          value={bloodData?.donors.length}
          description="+43 this month"
          icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Healthcare Analytics</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardStats />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivities />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

