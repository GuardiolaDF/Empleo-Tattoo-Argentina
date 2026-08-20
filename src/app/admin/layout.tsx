import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard - Empleo Tattoo Argentina",
  description: "Panel de control y administración para Empleo Tattoo Argentina",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Guard de Seguridad: Solo usuarios autenticados con rol 'admin'
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/login?error=UnauthorizedAdmin");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row antialiased">
      <AdminSidebar userEmail={session.user.email} />
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
