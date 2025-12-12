"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Search, Store, Trash } from "lucide-react"
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

const pharmacies = [
  {
    id: 1,
    name: "HealthPlus Pharmacy",
    address: "123 Main St, Cityville",
    contact: "+1 (555) 123-4567",
    hours: "8:00 AM - 10:00 PM",
    type: "Retail",
    status: "Open",
  },
  {
    id: 2,
    name: "MediCare Pharmacy",
    address: "456 Oak Ave, Townsville",
    contact: "+1 (555) 234-5678",
    hours: "24 Hours",
    type: "Hospital",
    status: "Open",
  },
  {
    id: 3,
    name: "Wellness Drugs",
    address: "789 Pine Rd, Villagetown",
    contact: "+1 (555) 345-6789",
    hours: "9:00 AM - 9:00 PM",
    type: "Retail",
    status: "Open",
  },
  {
    id: 4,
    name: "Ayurvedic Remedies",
    address: "101 Herbal Lane, Natureville",
    contact: "+1 (555) 456-7890",
    hours: "10:00 AM - 7:00 PM",
    type: "Specialty",
    status: "Open",
  },
  {
    id: 5,
    name: "City Medical Supplies",
    address: "202 Health Blvd, Metropolis",
    contact: "+1 (555) 567-8901",
    hours: "8:00 AM - 8:00 PM",
    type: "Retail",
    status: "Closed",
  },
]

export function PharmaciesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPharmacy, setNewPharmacy] = useState({
    name: "",
    address: "",
    contact: "",
    hours: "",
    type: "",
  })

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const matchesSearch =
      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || pharmacy.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleAddPharmacy = () => {
    // In a real app, you would add the pharmacy to your database
    alert({
      title: "Pharmacy added",
      description: `${newPharmacy.name} has been added successfully.`,
    })
    setIsAddDialogOpen(false)
    setNewPharmacy({
      name: "",
      address: "",
      contact: "",
      hours: "",
      type: "",
    })
  }

  const handleDeletePharmacy = (id, name) => {
    // In a real app, you would delete the pharmacy from your database
    alert({
      title: "Pharmacy deleted",
      description: `${name} has been deleted successfully.`,
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Pharmacies</CardTitle>
          <CardDescription>Manage all pharmacies in the system</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Pharmacy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Pharmacy</DialogTitle>
              <DialogDescription>Enter the details of the new pharmacy here.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Pharmacy Name</Label>
                <Input
                  id="name"
                  value={newPharmacy.name}
                  onChange={(e) => setNewPharmacy({ ...newPharmacy, name: e.target.value })}
                  placeholder="Enter pharmacy name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newPharmacy.address}
                  onChange={(e) => setNewPharmacy({ ...newPharmacy, address: e.target.value })}
                  placeholder="Enter pharmacy address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={newPharmacy.contact}
                  onChange={(e) => setNewPharmacy({ ...newPharmacy, contact: e.target.value })}
                  placeholder="Enter contact number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hours">Operating Hours</Label>
                <Input
                  id="hours"
                  value={newPharmacy.hours}
                  onChange={(e) => setNewPharmacy({ ...newPharmacy, hours: e.target.value })}
                  placeholder="Enter operating hours"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  onValueChange={(value) => setNewPharmacy({ ...newPharmacy, type: value })}
                  defaultValue={newPharmacy.type}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Hospital">Hospital</SelectItem>
                    <SelectItem value="Specialty">Specialty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPharmacy}>Add Pharmacy</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center space-x-2 sm:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pharmacies..."
                className="h-9 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 w-full sm:w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Hospital">Hospital</SelectItem>
                <SelectItem value="Specialty">Specialty</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Address</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Hours</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPharmacies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No pharmacies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPharmacies.map((pharmacy) => (
                    <TableRow key={pharmacy.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-muted-foreground" />
                          {pharmacy.name}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{pharmacy.address}</TableCell>
                      <TableCell className="hidden md:table-cell">{pharmacy.contact}</TableCell>
                      <TableCell className="hidden md:table-cell">{pharmacy.hours}</TableCell>
                      <TableCell>{pharmacy.type}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            pharmacy.status === "Open"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          {pharmacy.status}
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
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeletePharmacy(pharmacy.id, pharmacy.name)}
                            >
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
        </div>
      </CardContent>
    </Card>
  )
}
