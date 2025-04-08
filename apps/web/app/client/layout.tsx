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
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:flex">
        <ClientSidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Bottom navigation - mobile only */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background">
        <ClientBottomNav />
      </div>
    </div>
  );
}
