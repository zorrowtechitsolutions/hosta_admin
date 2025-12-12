// app/components/login/LoginForm.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function LoginForm({ onSuccess }) {
  const router = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Predefined admin credentials
  const ADMIN_EMAIL = "hostaadmin@gmail.com"
  const ADMIN_PASSWORD = "hosta123"

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple validation
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields")
      setIsLoading(false)
      return
    }

    // Simulate API call with timeout
    setTimeout(() => {
      // Check credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store email in localStorage
        localStorage.setItem("adminEmail", email)
        
        toast.success("Login successful! Redirecting...")
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess()
        }
        
        // Redirect to dashboard or home page
        router("/")
      } else {
        toast.error("Invalid credentials. Please check your email and password")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-primary hover:underline focus:outline-none flex items-center gap-1"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Show
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              type="submit" 
              className="w-full mt-5" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}