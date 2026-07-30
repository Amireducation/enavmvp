import { NextResponse } from "next/server"
import { seedDemoUsers } from "@/lib/seed-demo-users"

export async function POST(request: Request) {
  try {
    // Optional: Add a secret key verification for security
    const authHeader = request.headers.get("authorization")
    const expectedSecret = process.env.SEED_SECRET || "dev-seed-secret"
    
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await seedDemoUsers()
    
    return NextResponse.json(
      { message: "Demo users seeded successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json(
      { error: "Failed to seed demo users" },
      { status: 500 }
    )
  }
}
