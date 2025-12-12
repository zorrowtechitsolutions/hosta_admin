import AmbulancePage from "@/pages/Ambulance";
import BloodDonorsPage from "@/pages/BloodDonors";
import DoctorsPage from "@/pages/Doctors";
import Home from "@/pages/Home";
import HospitalsPage from "@/pages/Hospitals";
import SpecialtiesPage from "@/pages/Specialities";
import UsersPage from "@/pages/Users";
import React from "react";
import { Route, Routes } from "react-router-dom";
import HospitalsDoctorsPage from "@/pages/Hospital-Doctors";
import BookingsPage from "@/pages/Booking";
import BannersPage from "@/pages/Banners";
import LoginPage from "@/pages/auth/Login";
import ProtectedRoutes from "@/utils/ProtectedRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<LoginPage />} />

 <Route element={<ProtectedRoutes />}>
      <Route path="/" element={<Home />} />
      <Route path="/hospitals" element={<HospitalsPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/ambulance" element={<AmbulancePage />} />
      <Route path="/blood-donors" element={<BloodDonorsPage />} />
      <Route path="/specialties" element={<SpecialtiesPage />} />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/banners" element={<BannersPage />} />
      <Route path="/hospitals/doctors/:hospitalId" element={<HospitalsDoctorsPage />} />
      </Route>
    </Routes>
  );
}
