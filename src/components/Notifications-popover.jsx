"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const notifications = [
  {
    id: 1,
    title: "New Doctor Registration",
    message: "Dr. Sarah Johnson has registered as a new doctor.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Ambulance Request",
    message: "New ambulance request from City General Hospital.",
    time: "3 hours ago",
    read: false,
  },
  {
    id: 3,
    title: "Blood Donation Request",
    message: "Urgent request for O+ blood type at Children's Medical Center.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 4,
    title: "System Update",
    message: "The system will undergo maintenance tonight at 2:00 AM.",
    time: "1 day ago",
    read: true,
  },
  {
    id: 5,
    title: "New Hospital Added",
    message: "Ayurveda Wellness Center has been added to the system.",
    time: "2 days ago",
    read: true,
  },
]

export function NotificationsPopover() {
  const [open, setOpen] = useState(false)
  const [userNotifications, setUserNotifications] = useState(notifications)

  const unreadCount = userNotifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setUserNotifications(userNotifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id) => {
    setUserNotifications(userNotifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {userNotifications.length === 0 ? (
            <div className="flex h-full items-center justify-center p-6">
              <p className="text-center text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {userNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex cursor-pointer flex-col border-b p-3 hover:bg-muted/50 ${
                    !notification.read ? "bg-muted/20" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <h5 className="font-medium">{notification.title}</h5>
                    {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                  <span className="mt-2 text-xs text-muted-foreground">{notification.time}</span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full justify-center">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
