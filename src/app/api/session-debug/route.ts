import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  return NextResponse.json({
    email: session?.user?.email,
    role: session?.user?.role,
    rawSession: session
  });
}
