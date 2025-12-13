"use client"

import { useState, useEffect } from "react"
import { AmbulanceIcon, Edit, MoreHorizontal, Plus, Search, Trash, X, MapPin, Hash, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useAddNewAmbulanceMutation, useDeleteAmbulanceMutation, useEditAmbulanceMutation, useGetAllAmbulanceQuery } from "@/app/service/ambulance"
import { Skeleton } from "@/components/ui/skeleton"

// Custom Select with Search Component with better styling
const SelectWithSearch = ({ value, onValueChange, options, placeholder, searchPlaceholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredOptions(filtered)
    } else {
      setFilteredOptions(options)
    }
  }, [searchTerm, options])

  const handleSelect = (value) => {
    onValueChange(value)
    setIsOpen(false)
    setSearchTerm("")
  }

  const getDisplayValue = () => {
    if (!value) return placeholder
    const selectedOption = options.find(option => option.value === value)
    return selectedOption ? selectedOption.label : value
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start h-10 bg-white hover:bg-gray-50 text-left"
        onClick={() => setIsOpen(true)}
      >
        <span className="truncate text-gray-800">{getDisplayValue()}</span>
      </Button>
      
      {isOpen && (
        // <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <h3 className="text-lg font-semibold text-gray-800">{placeholder}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-gray-800 bg-transparent border-none"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 border-b bg-white">
              <div className="flex items-center border rounded-md px-3 py-2 bg-white">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto bg-white">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full text-left p-3 hover:bg-gray-50 transition-colors bg-white ${
                      value === option.value
                        ? "bg-blue-50 border-r-4 border-blue-600"
                        : ""
                    }`}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span className="text-gray-800">
                      {option.label}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        // </div>
      )}
    </div>
  )
}

// Ambulance Form Component
const AmbulanceForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isLoading, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    phone: "",
    vehicleType: "",
    place: "",
    pincode: "",
    country: "",
    state: "",
    district: "",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [statesCitiesData, setStatesCitiesData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load all data
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoadingData(true);
      try {
        // Load countries
        const worldCountries = await import("world-countries");
        const formattedCountries = worldCountries.default.map((country) => ({
          value: country.cca3,
          label: `${country.flag || "🏳️"} ${country.name.common}`,
          name: country.name.common,
          iso3: country.cca3
        }));
        setCountries(formattedCountries);

        // Load states/cities data
        try {
          const data = await import("../data/countries+states+cities.json");
          setStatesCitiesData(data.default || []);
        } catch (error) {
          console.error("Failed to load states/cities data:", error);
          setStatesCitiesData([]);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setCountries([
          { value: "IND", label: "🇮🇳 India", name: "India", iso3: "IND" },
          { value: "USA", label: "🇺🇸 United States", name: "United States", iso3: "USA" },
          { value: "GBR", label: "🇬🇧 United Kingdom", name: "United Kingdom", iso3: "GBR" },
        ]);
        setStatesCitiesData([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAllData();
  }, []);

  // Initialize form data when initialData or data changes
  useEffect(() => {
    if (!isLoadingData && initialData) {
      
      const editData = {
        serviceName: initialData.serviceName || "",
        phone: initialData.phone || "",
        vehicleType: initialData.vehicleType || "",
        place: initialData?.place || "",
        pincode: initialData?.pincode?.toString() || "",
        country: initialData?.country || "",
        state: initialData?.state || "",
        district: initialData?.district || "",
      };

      

      // Find country by name
      if (initialData.address?.country) {
        const foundCountry = countries.find(
          country => country?.name === initialData.address.country
        );
        if (foundCountry) {
          editData.country = foundCountry.value;
        } else {
          // Try to find by ISO code
          const foundByIso = countries.find(
            country => country.iso3 === initialData.address.country
          );
          if (foundByIso) {
            editData.country = foundByIso.value;
          } else {
            // If not found, use the name as value
            editData.country = initialData.address.country;
          }
        }
      }

      console.log(editData, "iiiii");
      

      setFormData(editData);
      
      // Load states for this country
      if (editData.country && statesCitiesData.length > 0) {
        const selectedCountry = statesCitiesData.find(
          (country) => country.iso3 === editData.country || country.name === editData.country
        );
        if (selectedCountry && Array.isArray(selectedCountry.states)) {
          const stateOptions = selectedCountry.states.map((state) => ({
            value: state.state_code,
            label: state.name,
            name: state.name
          }));
          setStates(stateOptions);
        } else {
          setStates([]);
        }
      }

      // Load districts for this state
      if (editData.state && editData.country && statesCitiesData.length > 0) {
        const selectedCountry = statesCitiesData.find(
          (country) => country.iso3 === editData.country || country.name === editData.country
        );
        if (selectedCountry) {
          const selectedState = selectedCountry.states?.find(
            (state) => state.state_code === editData.state || state.name === editData.state
          );
          if (selectedState && Array.isArray(selectedState.cities)) {
            const districtOptions = selectedState.cities.map((city) => ({
              value: city.id.toString(),
              label: city.name,
              name: city.name
            }));
            setDistricts(districtOptions);
          } else {
            setDistricts([]);
          }
        }
      }
    } else if (!initialData) {
      // Reset for new entry
      setFormData({
        serviceName: "",
        phone: "",
        vehicleType: "",
        place: "",
        pincode: "",
        country: "",
        state: "",
        district: "",
      });
      setStates([]);
      setDistricts([]);
    }
  }, [initialData, countries, statesCitiesData, isLoadingData]);

  // Update states when country changes
  useEffect(() => {
    if (formData.country && statesCitiesData.length > 0) {
      const selectedCountry = statesCitiesData.find(
        (country) => country.iso3 === formData.country || country.name === formData.country
      );

      if (selectedCountry && Array.isArray(selectedCountry.states)) {
        const stateOptions = selectedCountry.states.map((state) => ({
          value: state.state_code,
          label: state.name,
          name: state.name
        }));
        setStates(stateOptions);
      } else {
        setStates([]);
      }

      setFormData((prev) => ({ ...prev, state: "", district: "" }));
      setDistricts([]);
    }
  }, [formData.country, statesCitiesData]);

  // Update districts when state changes
  useEffect(() => {
    if (formData.state && formData.country && statesCitiesData.length > 0) {
      const selectedCountry = statesCitiesData.find(
        (country) => country.iso3 === formData.country || country.name === formData.country
      );

      if (selectedCountry) {
        const selectedState = selectedCountry.states?.find(
          (state) => state.state_code === formData.state || state.name === formData.state
        );

        if (selectedState && Array.isArray(selectedState.cities)) {
          const districtOptions = selectedState.cities.map((city) => ({
            value: city.id.toString(),
            label: city.name,
            name: city.name
          }));
          setDistricts(districtOptions);
        } else {
          setDistricts([]);
        }
      }

      setFormData((prev) => ({ ...prev, district: "" }));
    }
  }, [formData.state, formData.country, statesCitiesData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.serviceName.trim()) e.serviceName = "Service name is required";
    if (!formData.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone)) e.phone = "Phone must be exactly 10 digits";
    if (!formData.vehicleType) e.vehicleType = "Vehicle type is required";
    if (!formData.place.trim()) e.place = "Place is required";
    if (!formData.country) e.country = "Country is required";
    if (!formData.pincode.trim()) e.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode)) e.pincode = "Pincode must be exactly 6 digits";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    // Get country name from selected country
    const selectedCountry = countries.find(
      (country) => country.value === formData.country
    );
    const countryName = selectedCountry ? selectedCountry.name : formData.country;

    // Create address object
    const address = {
      place: formData.place.trim(),
      pincode: Number(formData.pincode),
      country: countryName,
    };

    // Add state if available
    if (formData.state && formData.state.trim()) {
      const selectedState = states.find((state) => state.value === formData.state);
      address.state = selectedState ? selectedState.name : formData.state;
    }

    // Add district if available
    if (formData.district && formData.district.trim()) {
      const selectedDistrict = districts.find(
        (district) => district.value === formData.district
      );
      address.district = selectedDistrict ? selectedDistrict.name : formData.district;
    }

    const payload = {
      serviceName: formData.serviceName.trim(),
      phone: formData?.phone,
      vehicleType: formData?.vehicleType,
      address: address,
    };

    onSubmit(payload);
  };

  const getCountryOptions = () => {
    return countries.map(country => ({
      value: country?.value,
      label: country?.label,
    }));
  };

  const getStateOptions = () => {
    return states.map(state => ({
      value: state?.value,
      label: state?.label,
    }));
  };

  const getDistrictOptions = () => {
    return districts.map(district => ({
      value: district?.value,
      label: district?.label,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Ambulance" : "Add New Ambulance"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update ambulance details" : "Add a new ambulance to the system"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Service Name */}
          <div className="grid gap-2">
            <Label htmlFor="serviceName">Service Name</Label>
            <Input
              id="serviceName"
              placeholder="Enter service name"
              value={formData?.serviceName}
              onChange={(e) => handleChange("serviceName", e.target.value)}
            />
            {errors.serviceName && (
              <p className="text-sm text-red-500">{errors.serviceName}</p>
            )}
          </div>

          {/* Phone */}
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="flex items-center border rounded-md px-3">
              <Phone size={16} className="text-gray-400 mr-2" />
              <Input
                id="phone"
                placeholder="9876543210"
                value={formData?.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="border-0 px-0"
                maxLength={10}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Vehicle Type */}
          <div className="grid gap-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select
              value={formData?.vehicleType}
              onValueChange={(value) => handleChange("vehicleType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
              </SelectContent>
            </Select>
            {errors.vehicleType && (
              <p className="text-sm text-red-500">{errors.vehicleType}</p>
            )}
          </div>

          {/* Country Selection */}
          <div className="grid gap-2">
            <Label>Country</Label>
            <SelectWithSearch
              value={formData?.country}
              onValueChange={(value) => handleChange("country", value)}
              options={getCountryOptions()}
              placeholder="Select country"
              searchPlaceholder="Search country..."
            />
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country}</p>
            )}
          </div>

          {/* State Selection - Show always when country is selected */}
          {formData.country && (
            <div className="grid gap-2">
              <Label>State (Optional)</Label>
              {states.length > 0 ? (
                <SelectWithSearch
                  value={formData?.state}
                  onValueChange={(value) => handleChange("state", value)}
                  options={getStateOptions()}
                  placeholder="Select state"
                  searchPlaceholder="Search state..."
                />
              ) : (
                <Input
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              )}
            </div>
          )}

          {/* District Selection - Show when state is entered */}
          {formData.state && (
            <div className="grid gap-2">
              <Label>District (Optional)</Label>
              {districts.length > 0 ? (
                <SelectWithSearch
                  value={formData?.district}
                  onValueChange={(value) => handleChange("district", value)}
                  options={getDistrictOptions()}
                  placeholder="Select district"
                  searchPlaceholder="Search district..."
                />
              ) : (
                <Input
                  placeholder="Enter district"
                  value={formData?.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                />
              )}
            </div>
          )}

          {/* Place and Pincode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="place">Place (Area/Locality)</Label>
              <div className="flex items-center border rounded-md px-3">
                <MapPin size={16} className="text-gray-400 mr-2" />
                <Input
                  id="place"
                  placeholder="Enter locality"
                  value={formData?.place}
                  onChange={(e) => handleChange("place", e.target.value)}
                  className="border-0 px-0"
                />
              </div>
              {errors.place && (
                <p className="text-sm text-red-500">{errors.place}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pincode">Pincode</Label>
              <div className="flex items-center border rounded-md px-3">
                <Hash size={16} className="text-gray-400 mr-2" />
                <Input
                  id="pincode"
                  placeholder="123456"
                  maxLength={6}
                  value={formData?.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  className="border-0 px-0"
                />
              </div>
              {errors.pincode && (
                <p className="text-sm text-red-500">{errors.pincode}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function AmbulanceList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [formOpen, setFormOpen] = useState(false)
  const [editingAmbulance, setEditingAmbulance] = useState(null)

  

  const { data, isError, isLoading, refetch } = useGetAllAmbulanceQuery();
  const [addNewAmbulance, { isLoading: isAdding }] = useAddNewAmbulanceMutation()
  const [deleteAmbulance, { isLoading: isDeleting }] = useDeleteAmbulanceMutation()
  const [editAmbulance, { isLoading: isUpdating }] = useEditAmbulanceMutation()

  // Extract ambulances data from the API response
  const ambulances = data?.data || [];

  // Table Skeleton Component
  const TableSkeleton = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service Name</TableHead>
            <TableHead>Vehicle Type</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden md:table-cell">Address</TableHead>
            <TableHead className="hidden md:table-cell">Created At</TableHead>
            <TableHead className="hidden md:table-cell">Updated At</TableHead>
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
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-32" />
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

  // Filter ambulances based on search term and vehicle type
  const filteredAmbulances = ambulances.filter((ambulance) => {
    const serviceName = ambulance.serviceName || '';
    const phone = ambulance.phone || '';
    const address = ambulance.address || '';
    const vehicleType = ambulance.vehicleType || '';
    
    const matchesSearch =
      serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVehicleType = vehicleTypeFilter === "all" || ambulance.vehicleType === vehicleTypeFilter;
    
    return matchesSearch && matchesVehicleType;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAmbulances.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAmbulances.length / itemsPerPage);

  const handleAddAmbulance = async (formData) => {
    try {
      await addNewAmbulance(formData).unwrap();
      refetch();
      setFormOpen(false);
    } catch (error) {
      console.error("Failed to add ambulance:", error);
    }
  };

  const handleEditAmbulance = async (formData) => {
    try {
      console.log(formData, "form");
      
      // await editAmbulance({
      //   id: editingAmbulance._id,
      // formData
      // }).unwrap();
      refetch();
      setFormOpen(false);
      setEditingAmbulance(null);
    } catch (error) {
      console.error("Failed to edit ambulance:", error);
    }
  };

  const handleDeleteAmbulance = async (id) => {
    if (confirm("Are you sure you want to delete this ambulance?")) {
      try {
        await deleteAmbulance(id).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete ambulance:", error);
      }
    }
  };

  const handleEditClick = (ambulance) => {
    setEditingAmbulance(ambulance);
    setFormOpen(true);
  };

  const formatAddress = (ambulance) => {
    if (!ambulance.address) return 'N/A';
    const addr = ambulance.address;
    const parts = [
      addr?.place,
      addr?.district,
      addr?.state,
      addr?.country,
      addr?.pincode ? `Pincode: ${addr.pincode}` : null
    ].filter(Boolean);
    return parts.join(', ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ambulances</h2>
        <Button onClick={() => {
          setEditingAmbulance(null);
          setFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Ambulance
        </Button>
      </div>

      <AmbulanceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingAmbulance ? handleEditAmbulance : handleAddAmbulance}
        isLoading={isAdding || isUpdating}
        initialData={editingAmbulance ? {
          serviceName: editingAmbulance?.serviceName || "",
          phone: editingAmbulance?.phone || "",
          vehicleType: editingAmbulance?.vehicleType || "",
          place: editingAmbulance?.address?.place || "",
          pincode: editingAmbulance?.address?.pincode?.toString() || "",
          country: editingAmbulance?.address?.country || "",
          state: editingAmbulance?.address?.state || "",
          district: editingAmbulance?.address?.district || "",
        } : undefined}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Ambulances List</CardTitle>
            <CardDescription>Manage all ambulances in the system</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full items-center space-x-2 sm:w-auto">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ambulance..."
                  className="h-9 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  disabled={isLoading}
                />
              </div>
              <Select
                value={vehicleTypeFilter}
                onValueChange={(value) => {
                  setVehicleTypeFilter(value);
                  setCurrentPage(1);
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="h-9 w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
             <SelectContent>
  <SelectItem value="all">All Ambulance Types</SelectItem>
  <SelectItem value="bls">BLS – Basic Life Support</SelectItem>
  <SelectItem value="als">ALS – Advanced Life Support</SelectItem>
  <SelectItem value="icu">ICU Ambulance</SelectItem>
  <SelectItem value="nicu">NICU Ambulance</SelectItem>
  <SelectItem value="cardiac">Cardiac Ambulance</SelectItem>
  <SelectItem value="patient-transport">Patient Transport</SelectItem>
  <SelectItem value="mortuary">Mortuary Ambulance</SelectItem>
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
                        <TableHead>Service Name</TableHead>
                        <TableHead>Vehicle Type</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead className="hidden md:table-cell">Address</TableHead>
                        <TableHead className="hidden md:table-cell">Created At</TableHead>
                        <TableHead className="hidden md:table-cell">Updated At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No ambulances found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentItems.map((ambulance) => (
                          <TableRow key={ambulance._id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <AmbulanceIcon className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-medium truncate">{ambulance.serviceName || 'N/A'}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                {ambulance.vehicleType || 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="font-mono text-sm">{ambulance.phone || 'N/A'}</span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="max-w-[200px]">
                                <div className="text-sm truncate" title={formatAddress(ambulance)}>
                                  {formatAddress(ambulance)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar size={12} />
                                {formatDate(ambulance.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar size={12} />
                                {formatDate(ambulance.updatedAt)}
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
                                    onClick={() => navigator.clipboard.writeText(ambulance._id)}
                                  >
                                    Copy Ambulance ID
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleEditClick(ambulance)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteAmbulance(ambulance._id)}
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

                {/* Pagination */}
                {filteredAmbulances.length > 0 && (
                  <div className="flex w-full items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                      Showing <strong>{indexOfFirstItem + 1}</strong> to{" "}
                      <strong>{Math.min(indexOfLastItem, filteredAmbulances.length)}</strong> of{" "}
                      <strong>{filteredAmbulances.length}</strong> ambulances
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