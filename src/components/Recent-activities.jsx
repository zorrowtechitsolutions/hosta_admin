"use client"

import { useGetAllHospitalQuery } from "@/app/service/hospital";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Building2 } from "lucide-react";

export function RecentActivities() {
  const { data: apiData } = useGetAllHospitalQuery();
  
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      
      // Format as "MMM DD, YYYY" (e.g., "Dec 15, 2024")
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date Error";
    }
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'H';
    
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  // Get recent activities sorted by date
  const getRecentActivities = () => {
    if (!apiData?.data || !Array.isArray(apiData.data)) {
      return [];
    }
    
    return [...apiData.data]
      .filter(hospital => hospital.createdAt || hospital.updatedAt)
      .sort((a, b) => {
        // Sort by date (most recent first)
        const dateA = new Date(a.createdAt || a.updatedAt);
        const dateB = new Date(b.createdAt || b.updatedAt);
        return dateB - dateA;
      })
      .slice(0, 6); // Get only 6 most recent
  };

  const recentActivities = getRecentActivities();

  if (recentActivities.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent activities</p>
          <p className="text-gray-400 text-sm mt-1">
            Hospital activities will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => (
        <div key={activity._id || activity.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9 border">
            {activity?.image?.imageUrl ? (
              <AvatarImage 
                src={activity.image.imageUrl} 
                alt={activity.name}
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.style.display = 'none';
                }}
              />
            ) : null}
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials(activity.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-sm font-medium leading-none truncate">
              <span className="font-semibold">{activity.name}</span> 
              <span className="text-gray-500 ml-2 text-xs">
                {activity.type ? `(${activity.type})` : ''}
              </span>
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {formatDate(activity.createdAt || activity.updatedAt)}
              </p>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                Added
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}