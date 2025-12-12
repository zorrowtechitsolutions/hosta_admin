"use client"

import { useState } from "react"
import { Droplets, Edit, MoreHorizontal, Plus, Search, Trash } from "lucide-react"
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
import { useGetAllBloodQuery } from "@/app/service/blood"
import { Skeleton } from "@/components/ui/skeleton"

export function BloodDonorsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [bloodTypeFilter, setBloodTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const { data, isError, isLoading, refetch } = useGetAllBloodQuery();
  
  // Extract donors data from the API response
  const donors = data?.donors || [];

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format location compactly
  const formatLocation = (address) => {
    if (!address) return 'N/A';
    
    const parts = [];
    if (address.place) parts.push(address.place);
    if (address.district) parts.push(address.district);
    
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  // Table Skeleton Component
  const TableSkeleton = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Blood Type</TableHead>
            <TableHead className="hidden md:table-cell">Age</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden md:table-cell">Pincode</TableHead>
            <TableHead className="hidden md:table-cell">Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-12 rounded-full" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-20" />
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

  // Filter donors based on search term and blood type
  const filteredDonors = donors.filter((donor) => {
    const userName = donor.userId?.name || '';
    const userEmail = donor.userId?.email || '';
    const phone = donor.phone || '';
    const place = donor.address?.place || '';
    const district = donor.address?.district || '';
    const pincode = donor.address?.pincode || '';
    
    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      place.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pincode.includes(searchTerm);
    
    const matchesBloodType = bloodTypeFilter === "all" || donor.bloodGroup === bloodTypeFilter;
    
    return matchesSearch && matchesBloodType;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDonors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);

  // Handle error state
  if (isError) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Blood Donors</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">Error loading blood donors. Please try again.</div>
            <Button onClick={refetch} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Blood Donors</h2>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Blood Donors List</CardTitle>
            <CardDescription>Manage all blood donors in the system</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full items-center space-x-2 sm:w-auto">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search donors..."
                  className="h-9 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  disabled={isLoading}
                />
              </div>
              <Select
                value={bloodTypeFilter}
                onValueChange={(value) => {
                  setBloodTypeFilter(value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="h-9 w-full sm:w-[180px]">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blood Types</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
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
                        <TableHead>Blood Type</TableHead>
                        <TableHead className="hidden md:table-cell">Age</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead className="hidden md:table-cell">Location</TableHead>
                        <TableHead className="hidden md:table-cell">Pincode</TableHead>
                        <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No donors found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentItems.map((donor) => (
                          <TableRow key={donor._id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                  <Droplets className="h-4 w-4 text-red-600" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-medium truncate">{donor.userId?.name || 'N/A'}</div>
                                  <div className="text-xs text-muted-foreground truncate">{donor.userId?.email || 'N/A'}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
                                {donor.bloodGroup || 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {calculateAge(donor.dateOfBirth)} years
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="font-mono text-sm">{donor.phone || 'N/A'}</span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="max-w-[120px]">
                                <div className="text-sm truncate" title={formatLocation(donor.address)}>
                                  {formatLocation(donor.address)}
                                </div>
                                {donor.address?.state && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {donor.address.state}
                                    {donor.address.country && `, ${donor.address.country}`}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="font-mono text-sm">
                                {donor.address?.pincode || 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="text-sm">
                                {donor.updatedAt ? 
                                  new Date(donor.updatedAt).toLocaleDateString() : 
                                  'N/A'
                                }
                              </div>
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
                                    onClick={() => navigator.clipboard.writeText(donor._id)}
                                  >
                                    Copy Donor ID
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
                {filteredDonors.length > 0 && (
                  <div className="flex w-full items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                      Showing <strong>{indexOfFirstItem + 1}</strong> to{" "}
                      <strong>{Math.min(indexOfLastItem, filteredDonors.length)}</strong> of{" "}
                      <strong>{filteredDonors.length}</strong> donors
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
  );
}