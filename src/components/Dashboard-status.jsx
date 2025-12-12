// "use client"


import { useGetAllHospitalQuery } from "@/app/service/hospital"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"


// Alternative: Monthly breakdown version
export function DashboardStats() {
  const [mounted, setMounted] = useState(false)
  const { data: apiData, isLoading, isError, refetch } = useGetAllHospitalQuery();
  
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    if (apiData?.data) {
      // Group by month based on createdAt
      const monthlyStats = {};
      
      apiData.data.forEach(hospital => {
        const date = new Date(hospital.createdAt);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const key = `${month} ${year}`;
        
        if (!monthlyStats[key]) {
          monthlyStats[key] = {
            name: month,
            clinics: 0,
            hospitals: 0,
            total: 0
          };
        }
        
        // Determine type
        if (hospital.working_hours_clinic && 
            Array.isArray(hospital.working_hours_clinic) && 
            hospital.working_hours_clinic.length > 0) {
          monthlyStats[key].clinics++;
        } else {
          monthlyStats[key].hospitals++;
        }
        
        monthlyStats[key].total++;
      });
      
      // Convert to array and sort by date
      const sortedData = Object.values(monthlyStats)
        .sort((a, b) => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return months.indexOf(a.name) - months.indexOf(b.name);
        });
      
      setMonthlyData(sortedData);
    }
  }, [apiData]);

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart  data={monthlyData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <Tooltip />
        <Legend />
        <Bar dataKey="clinics" name="Clinics" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="hospitals" name="Hospitals" fill="#06b6d4" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}