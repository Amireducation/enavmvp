import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function seedDemoUsers() {
  try {
    const demoUsers = [
      {
        email: "citizen@ethionavigator.gov.et",
        fullName: "Demo Citizen",
        role: "citizen",
        password: "Demo@123",
      },
      {
        email: "employee@ethionavigator.gov.et",
        fullName: "Demo Employee",
        role: "employee",
        password: "Demo@123",
      },
      {
        email: "admin@ethionavigator.gov.et",
        fullName: "Demo Admin",
        role: "admin",
        password: "Demo@123",
      },
      {
        email: "partner@ethionavigator.gov.et",
        fullName: "Demo Partner",
        role: "partner",
        password: "Demo@123",
      },
    ]

    for (const user of demoUsers) {
      // Check if user already exists
      const existingUser = await sql`
        SELECT id FROM users WHERE email = ${user.email}
      `

      if (existingUser.length === 0) {
        // Hash password using PostgreSQL's pgcrypto
        const hashedPassword = await sql`
          SELECT crypt(${user.password}, gen_salt('bf')) as password_hash
        `

        // Insert new user
        await sql`
          INSERT INTO users (
            email,
            password_hash,
            full_name,
            role,
            status,
            email_verified,
            created_at,
            updated_at
          ) VALUES (
            ${user.email},
            ${hashedPassword[0].password_hash},
            ${user.fullName},
            ${user.role},
            'active',
            true,
            NOW(),
            NOW()
          )
        `

        console.log(`Created demo ${user.role} user: ${user.email}`)
      } else {
        console.log(`Demo ${user.role} user already exists: ${user.email}`)
      }
    }

    console.log("Demo users seeding completed")
  } catch (error) {
    console.error("Error seeding demo users:", error)
  }
}
