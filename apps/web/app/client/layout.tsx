import { ClientBottomNav } from "./_components/ClientBottomNav";
import { ClientSidebar } from "./_components/ClientSidebar";
import { redirect } from "next/navigation";
import { verifySessionAndGetUser } from "@/lib/server-auth-utils";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySessionAndGetUser();

  // Redirect to login if no session
  if (!session) {
    redirect("/login");
  }
  // Verify user is a client
  if (session.decodedClaims.role !== "client") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <ClientSidebar />
      </div>

      {/* Main content */}
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom navigation - mobile only */}
      <div className="md:hidden">
        <ClientBottomNav />
      </div>
    </div>
  );
}
