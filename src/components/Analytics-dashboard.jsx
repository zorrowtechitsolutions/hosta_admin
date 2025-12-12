"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts"

const hospitalData = [
  { name: "General", value: 45 },
  { name: "Ayurveda", value: 20 },
  { name: "Homeopathy", value: 15 },
  { name: "Skin", value: 10 },
  { name: "Pediatric", value: 10 },
]

const doctorData = [
  { name: "Pediatrics", value: 120 },
  { name: "Orthopedics", value: 95 },
  { name: "ENT", value: 75 },
  { name: "Dermatology", value: 60 },
  { name: "Ayurveda", value: 50 },
  { name: "Cardiology", value: 110 },
  { name: "Neurology", value: 65 },
]

const bloodDonorData = [
  { name: "O+", value: 35 },
  { name: "A+", value: 25 },
  { name: "B+", value: 20 },
  { name: "AB+", value: 5 },
  { name: "O-", value: 8 },
  { name: "A-", value: 4 },
  { name: "B-", value: 2 },
  { name: "AB-", value: 1 },
]

const monthlyRegistrationData = [
  {
    name: "Jan",
    hospitals: 2,
    doctors: 15,
    bloodDonors: 45,
  },
  {
    name: "Feb",
    hospitals: 3,
    doctors: 20,
    bloodDonors: 38,
  },
  {
    name: "Mar",
    hospitals: 1,
    doctors: 18,
    bloodDonors: 52,
  },
  {
    name: "Apr",
    hospitals: 4,
    doctors: 22,
    bloodDonors: 65,
  },
  {
    name: "May",
    hospitals: 2,
    doctors: 25,
    bloodDonors: 48,
  },
  {
    name: "Jun",
    hospitals: 5,
    doctors: 30,
    bloodDonors: 70,
  },
]

const ambulanceCallsData = [
  {
    name: "Jan",
    calls: 120,
  },
  {
    name: "Feb",
    calls: 145,
  },
  {
    name: "Mar",
    calls: 132,
  },
  {
    name: "Apr",
    calls: 165,
  },
  {
    name: "May",
    calls: 178,
  },
  {
    name: "Jun",
    calls: 156,
  },
]

const COLORS = ["#4f46e5", "#06b6d4", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

export function AnalyticsDashboard() {
  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? "start" : "end"

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="blood-donors">Blood Donors</TabsTrigger>
          <TabsTrigger value="ambulance">Ambulance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Registrations</CardTitle>
                <CardDescription>New registrations per month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRegistrationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hospitals" fill="#4f46e5" name="Hospitals" />
                    <Bar dataKey="doctors" fill="#06b6d4" name="Doctors" />
                    <Bar dataKey="bloodDonors" fill="#f43f5e" name="Blood Donors" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ambulance Calls</CardTitle>
                <CardDescription>Monthly ambulance service calls</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ambulanceCallsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="calls" stroke="#4f46e5" activeDot={{ r: 8 }} name="Calls" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Hospitals by Category</CardTitle>
                <CardDescription>Distribution of hospital types</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={hospitalData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                    >
                      {hospitalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Doctors by Specialty</CardTitle>
                <CardDescription>Distribution of doctor specialties</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={doctorData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#06b6d4" name="Doctors" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blood Donors by Type</CardTitle>
                <CardDescription>Distribution of blood donor types</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bloodDonorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {bloodDonorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hospitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Analytics</CardTitle>
              <CardDescription>Detailed analytics for hospitals</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={hospitalData}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {hospitalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Analytics</CardTitle>
              <CardDescription>Detailed analytics for doctors</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={doctorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#06b6d4" name="Doctors" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blood-donors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blood Donor Analytics</CardTitle>
              <CardDescription>Detailed analytics for blood donors</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bloodDonorData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {bloodDonorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ambulance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ambulance Service Analytics</CardTitle>
              <CardDescription>Detailed analytics for ambulance services</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ambulanceCallsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="calls"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="Calls"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
