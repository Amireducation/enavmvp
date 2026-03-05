import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { role, full_name, phone, status, preferred_language, city, region, address } = body

    const updated = await sql`
      UPDATE users SET
        role = COALESCE(${role || null}, role),
        full_name = COALESCE(${full_name || null}, full_name),
        phone = COALESCE(${phone || null}, phone),
        status = COALESCE(${status || null}, status),
        preferred_language = COALESCE(${preferred_language || null}, preferred_language),
        city = COALESCE(${city || null}, city),
        region = COALESCE(${region || null}, region),
        address = COALESCE(${address || null}, address),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, email, full_name, role, status, preferred_language, city, region
    `

    if (updated.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: updated[0] })
  } catch (error) {
    console.error("User update error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params

    // Soft delete - set status to 'suspended'
    await sql`UPDATE users SET status = 'suspended', updated_at = NOW() WHERE id = ${id}`

    return NextResponse.json({ message: "User deleted" })
  } catch (error) {
    console.error("User delete error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
