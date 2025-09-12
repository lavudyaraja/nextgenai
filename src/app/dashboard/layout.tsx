import React from "react"
import  {Navbar}  from "@/app/dashboard/Navbar"
import Sidebar from "@/app/dashboard/Sidebar"

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      {/* Sidebar - only visible on md+ */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 bg-gray-100">{children}</main>
      </div>
    </div>
  )
}