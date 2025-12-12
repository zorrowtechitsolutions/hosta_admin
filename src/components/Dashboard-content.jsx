"use client"


import { useEffect, useState } from "react"
import { Ambulance, Building2, Droplets, Stethoscope } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HospitalsList } from "@/components/hospitals-list"
import { DoctorsList } from "@/components/doctors-list"
import { AmbulanceList } from "@/components/ambulance-list"
import { BloodDonorsList } from "@/components/blood-donors-list"
import { SpecialtiesList } from "@/components/specialties-list"
import { PharmaciesList } from "@/components/pharmacies-list"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivities } from "@/components/recent-activities"

export function DashboardContent() {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch with tabs
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
        <div className="flex items-center space-x-2">
          <DashboardDatePicker />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 lg:grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="ambulance">Ambulance</TabsTrigger>
          <TabsTrigger value="blood-donors">Blood Donors</TabsTrigger>
          <TabsTrigger value="specialties">Specialties</TabsTrigger>
          <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Total Hospitals"
              value="124"
              description="+4 this month"
              icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardCard
              title="Total Doctors"
              value="842"
              description="+12 this month"
              icon={<Stethoscope className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardCard
              title="Ambulances"
              value="56"
              description="+2 this month"
              icon={<Ambulance className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardCard
              title="Blood Donors"
              value="1,284"
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
        </TabsContent>

        <TabsContent value="hospitals" className="space-y-4">
          <HospitalsList />
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <DoctorsList />
        </TabsContent>

        <TabsContent value="ambulance" className="space-y-4">
          <AmbulanceList />
        </TabsContent>

        <TabsContent value="blood-donors" className="space-y-4">
          <BloodDonorsList />
        </TabsContent>

        <TabsContent value="specialties" className="space-y-4">
          <SpecialtiesList />
        </TabsContent>

        <TabsContent value="pharmacies" className="space-y-4">
          <PharmaciesList />
        </TabsContent>
      </Tabs>
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

function DashboardDatePicker() {
  return (
    <div className="flex items-center space-x-2">
      <select className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <option>This Week</option>
        <option>This Month</option>
        <option>This Year</option>
        <option>All Time</option>
      </select>
    </div>
  )
}
