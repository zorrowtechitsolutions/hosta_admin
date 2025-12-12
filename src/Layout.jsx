import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col ">
      {/* <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main> */}

       <SidebarProvider>
            <Outlet />
            <Toaster />
          </SidebarProvider>
    </div>
  );
}
