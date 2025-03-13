import { getUserRole, requireRole } from "@/lib/server-auth-utils"

export default async function AdminDashboard() {
  // Ensure only admins can access this page
  await requireRole(["admin"])

  // Get the user role
  const userRole = await getUserRole()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg mb-4">Welcome to the Admin Dashboard!</p>
        <p className="text-gray-600">Your role: <span className="font-semibold">{userRole}</span></p>
      </div>
    </div>
  )
}

