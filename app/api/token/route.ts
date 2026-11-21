import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

// Issues a short-lived JWT for the logged-in user.
// The Express server verifies it with the same JWT_SECRET.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Server is not configured" }, { status: 500 });
  }

  const token = jwt.sign({ email: session.user.email, name: session.user.name }, secret, {
    expiresIn: "1h",
  });
  return NextResponse.json({ token }, { headers: { "Cache-Control": "no-store" } });
}
