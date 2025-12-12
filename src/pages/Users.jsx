import { DashboardLayout } from "@/components/Dahboard-layout";
import { UsersList } from "@/components/Users-list";


export default function UsersPage() {
  return (
    <DashboardLayout>
      <UsersList />
    </DashboardLayout>
  )
}
