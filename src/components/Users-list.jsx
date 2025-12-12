"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Search, Stethoscope, Trash } from "lucide-react"
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
import { useGetAllUserQuery } from "@/app/service/user"
import { Skeleton } from "@/components/ui/skeleton"

export function UsersList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const { data, isError, isLoading, refetch } = useGetAllUserQuery();
  
  // Extract users data from the API response
  const users = data?.data || [];

  // Filter users based on search term and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  // Table Skeleton Component
  const TableSkeleton = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead className="hidden md:table-cell">Created At</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  // Handle error state
  if (isError) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">Error loading users. Please try again.</div>
            <Button onClick={refetch} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Users List</CardTitle>
            <CardDescription>Manage all users in the system</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full items-center space-x-2 sm:w-auto">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or phone..."
                  className="h-9 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1) // Reset to first page on search
                  }}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value)
                  setCurrentPage(1) // Reset to first page on filter change
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="h-9 w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="hidden md:table-cell">Phone</TableHead>
                        <TableHead className="hidden md:table-cell">Created At</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentItems.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-medium">
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                  </span>
                                </div>
                                {user.name || 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="hidden md:table-cell">{user.phone || 'N/A'}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  user.status === "active" || !user.status
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                }`}
                              >
                                {user.status === "active" || !user.status ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => navigator.clipboard.writeText(user._id)}
                                  >
                                    Copy User ID
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                  <div className="flex w-full items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                      Showing <strong>{indexOfFirstItem + 1}</strong> to{" "}
                      <strong>{Math.min(indexOfLastItem, filteredUsers.length)}</strong> of{" "}
                      <strong>{filteredUsers.length}</strong> users
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}