import { LoginForm } from "@/components/Login"

export default function LoginPage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Left panel for desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-800 to-green-700 items-center justify-center p-8">
        <div className="max-w-md text-white">
          <div className="flex flex-col items-center text-center mb-10">
            <img 
              src="/logo.jpeg" 
              alt="Logo" 
              className="rounded-full w-28 h-28 border-4 border-white/20 mb-6 object-cover"
            />
            <h1 className="text-5xl font-bold mb-3">HostaCare</h1>
            <p className="text-xl text-blue-100">Hospital Management System</p>
          </div>
        </div>
      </div>

      {/* Right panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-sm lg:max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center text-center mb-10">
            <img 
              src="/logo.jpeg" 
              alt="Logo" 
              className="rounded-full w-24 h-24 border-4 border-blue-100 mb-4 object-cover"
            />
            <h1 className="text-3xl font-bold text-gray-900">HostaCare</h1>
            <p className="text-gray-600 mt-1">Hospital Management System</p>
          </div>

          <div className="mb-10">
            <LoginForm />
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} HostaCare Admin Panel
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Contact support: support@hostacare.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}