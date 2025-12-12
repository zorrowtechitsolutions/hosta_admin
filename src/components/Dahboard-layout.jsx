"use client"


import { useState } from "react"
import { TopNavbar } from "./Top-navbar"
import { AppSidebar } from "./App-sidebar"


export function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <AppSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-x-hidden bg-muted/30 pb-16">{children}</main>
      </div>
    </div>
  )
}
