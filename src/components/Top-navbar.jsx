"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./Mode-toggle"
import { UserNav } from "./User-nav"
import { NotificationsPopover } from "./Notifications-popover"

export function TopNavbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 shadow-sm">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="ml-auto flex items-center gap-2">
        <NotificationsPopover />
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  )
}
