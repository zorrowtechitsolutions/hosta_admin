import { DashboardLayout } from "@/components/Dahboard-layout";
import { HospitalsList } from "@/components/Hospitals-list";


export default function HospitalsPage() {
  return (
    <DashboardLayout>
      <HospitalsList />
    </DashboardLayout>
  )
}
