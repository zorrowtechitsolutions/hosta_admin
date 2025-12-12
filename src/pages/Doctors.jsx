import { DashboardLayout } from "@/components/Dahboard-layout";
import { DoctorsList } from "@/components/Doctors-list";

export default function DoctorsPage() {
  return (
    <DashboardLayout>
      <DoctorsList />
    </DashboardLayout>
  )
}
