"use client"

import { useEffect } from "react"
import {
  Activity,
  Ambulance,
  Building2,
  Droplets,
  Home,
  PieChart,
  Stethoscope,
  Store,
  Users,
  X,
  Image
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"

export function AppSidebar({ isOpen, setIsOpen }) {
  const location = useLocation()
  const pathname = location.pathname

  // Close the mobile sidebar when the route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-4">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <Activity className="h-6 w-6 text-primary" />
                <span className="text-xl">Hosta</span>
              </Link>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <SidebarContent pathname={pathname} />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden border-r bg-background md:block")}>
        <div className="flex h-full w-[240px] flex-col">
          <div className="flex h-16 items-center border-b px-4">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-xl">Hosta</span>
            </Link>
          </div>
          <ScrollArea className="flex-1">
            <SidebarContent pathname={pathname} />
          </ScrollArea>
        </div>
      </div>
    </>
  )
}

function SidebarContent({ pathname }) {
  return (
    <div className="px-3 py-4">
      <div className="space-y-1">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
      </div>
      <div className="mt-6">
        <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Healthcare Services
        </h3>
        <div className="space-y-1">
          <Link
            to="/hospitals"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/hospitals" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Building2 className="h-4 w-4" />
            Hospitals
          </Link>
          <Link
            to="/doctors"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/doctors" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Stethoscope className="h-4 w-4" />
            Doctors
          </Link>
          <Link
            to="/ambulance"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/ambulance" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Ambulance className="h-4 w-4" />
            Ambulance
          </Link>
          <Link
            to="/blood-donors"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/blood-donors" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Droplets className="h-4 w-4" />
            Blood Donors
          </Link>
          <Link
            to="/specialties"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/specialties" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Activity className="h-4 w-4" />
            Specialties
          </Link>
          <Link
            to="/bookings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/bookings" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Store className="h-4 w-4" />
            Bookings
          </Link>
             <Link
            to="/banners"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/banners" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Image className="h-4 w-4" />
            Banners
          </Link>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Administration
        </h3>
        <div className="space-y-1">
          <Link
            to="/users"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/users" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Users className="h-4 w-4" />
            Users
          </Link>
        </div>
      </div>
    </div>
  )
}
