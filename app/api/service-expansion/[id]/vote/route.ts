import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromRequest } from "@/lib/api-utils"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { voteType } = await request.json()
    const { id } = params

    if (!["upvote", "downvote"].includes(voteType)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 })
    }

    // Check if expansion exists
    const expansions = await sql`
      SELECT id, upvotes, downvotes FROM service_expansion_requests WHERE id = ${id}
    `

    if (expansions.length === 0) {
      return NextResponse.json({ error: "Expansion not found" }, { status: 404 })
    }

    // Check if user already voted
    const existingVotes = await sql`
      SELECT vote_type FROM service_expansion_votes WHERE expansion_id = ${id} AND user_id = ${user.id}
    `

    const currentVotes = expansions[0]

    if (existingVotes.length > 0) {
      const oldVoteType = existingVotes[0].vote_type

      if (oldVoteType === voteType) {
        // Remove vote (toggle off)
        await sql`
          DELETE FROM service_expansion_votes WHERE expansion_id = ${id} AND user_id = ${user.id}
        `

        if (voteType === "upvote") {
          await sql`
            UPDATE service_expansion_requests SET upvotes = upvotes - 1 WHERE id = ${id}
          `
        } else {
          await sql`
            UPDATE service_expansion_requests SET downvotes = downvotes - 1 WHERE id = ${id}
          `
        }
      } else {
        // Change vote
        await sql`
          UPDATE service_expansion_votes SET vote_type = ${voteType} WHERE expansion_id = ${id} AND user_id = ${user.id}
        `

        if (oldVoteType === "upvote" && voteType === "downvote") {
          await sql`
            UPDATE service_expansion_requests SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = ${id}
          `
        } else {
          await sql`
            UPDATE service_expansion_requests SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = ${id}
          `
        }
      }
    } else {
      // Add new vote
      await sql`
        INSERT INTO service_expansion_votes (expansion_id, user_id, vote_type)
        VALUES (${id}, ${user.id}, ${voteType})
      `

      if (voteType === "upvote") {
        await sql`
          UPDATE service_expansion_requests SET upvotes = upvotes + 1 WHERE id = ${id}
        `
      } else {
        await sql`
          UPDATE service_expansion_requests SET downvotes = downvotes + 1 WHERE id = ${id}
        `
      }
    }

    const updated = await sql`
      SELECT upvotes, downvotes FROM service_expansion_requests WHERE id = ${id}
    `

    return NextResponse.json({
      upvotes: updated[0].upvotes,
      downvotes: updated[0].downvotes,
    })
  } catch (error) {
    console.error("Vote error:", error)
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 })
  }
}
