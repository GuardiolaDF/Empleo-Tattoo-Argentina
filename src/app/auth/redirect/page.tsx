import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
  const session = await auth();
  
  if (session?.user?.role === "admin") {
    redirect("/admin");
  } else if (session?.user) {
    redirect("/dashboard/perfil");
  } else {
    redirect("/auth/login");
  }
}
