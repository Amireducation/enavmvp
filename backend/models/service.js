const fs = require("fs")
const path = require("path")
const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")

const seedPath = path.join(__dirname, "..", "data", "services.seed.json")
let memoryStore = []

function loadSeed() {
  if (memoryStore.length === 0) {
    try {
      const raw = fs.readFileSync(seedPath, "utf8")
      const data = JSON.parse(raw)
      memoryStore = data.services || []
    } catch (e) {
      memoryStore = []
    }
  }
}

async function listServices(filters = {}) {
  const { category, minFee, maxFee, search } = filters

  if (process.env.POSTGRES_CONN_STRING) {
    let query = "SELECT * FROM services WHERE is_archived = false"
    const params = []
    let paramIndex = 1

    if (category) {
      query += ` AND category = $${paramIndex++}`
      params.push(category)
    }

    if (minFee !== undefined) {
      query += ` AND service_fee >= $${paramIndex++}`
      params.push(Number.parseFloat(minFee))
    }

    if (maxFee !== undefined) {
      query += ` AND service_fee <= $${paramIndex++}`
      params.push(Number.parseFloat(maxFee))
    }

    if (search) {
      query += ` AND (name ILIKE $${paramIndex++} OR description ILIKE $${paramIndex})`
      params.push(`%${search}%`, `%${search}%`)
    }

    query += " ORDER BY created_at DESC"

    const res = await pool.query(query, params)
    return res.rows
  }

  loadSeed()
  let filtered = memoryStore.filter((s) => !s.is_archived)

  if (category) filtered = filtered.filter((s) => s.category === category)
  if (minFee !== undefined) filtered = filtered.filter((s) => s.service_fee >= Number.parseFloat(minFee))
  if (maxFee !== undefined) filtered = filtered.filter((s) => s.service_fee <= Number.parseFloat(maxFee))
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(
      (s) => s.name.toLowerCase().includes(searchLower) || s.description.toLowerCase().includes(searchLower),
    )
  }

  return filtered
}

async function getCategories() {
  if (process.env.POSTGRES_CONN_STRING) {
    const res = await pool.query("SELECT DISTINCT category FROM services WHERE is_archived = false ORDER BY category")
    return res.rows.map((r) => r.category)
  }

  loadSeed()
  const categories = [...new Set(memoryStore.filter((s) => !s.is_archived).map((s) => s.category))]
  return categories.sort()
}

async function searchServices(filters = {}) {
  const { query, category, minFee, maxFee, agency, sortBy = "created_at" } = filters

  if (process.env.POSTGRES_CONN_STRING) {
    let sql = "SELECT * FROM services WHERE is_archived = false"
    const params = []
    let paramIndex = 1

    if (query) {
      sql += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex + 1} OR category ILIKE $${paramIndex + 2})`
      params.push(`%${query}%`, `%${query}%`, `%${query}%`)
      paramIndex += 3
    }

    if (category) {
      sql += ` AND category = $${paramIndex++}`
      params.push(category)
    }

    if (minFee !== undefined) {
      sql += ` AND service_fee >= $${paramIndex++}`
      params.push(Number.parseFloat(minFee))
    }

    if (maxFee !== undefined) {
      sql += ` AND service_fee <= $${paramIndex++}`
      params.push(Number.parseFloat(maxFee))
    }

    if (agency) {
      sql += ` AND responsible_agency ILIKE $${paramIndex++}`
      params.push(`%${agency}%`)
    }

    const validSortColumns = ["created_at", "name", "service_fee", "category"]
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "created_at"
    sql += ` ORDER BY ${sortColumn} DESC`

    const res = await pool.query(sql, params)
    return res.rows
  }

  return listServices(filters)
}

async function getServiceById(id) {
  if (process.env.POSTGRES_CONN_STRING) {
    const res = await pool.query("SELECT * FROM services WHERE service_id = $1 LIMIT 1", [id])
    return res.rows[0]
  }
  loadSeed()
  return memoryStore.find((s) => s.service_id === id)
}

async function getServiceStats(serviceId) {
  if (process.env.POSTGRES_CONN_STRING) {
    const applicationsRes = await pool.query(
      "SELECT COUNT(*) as total, status FROM applications WHERE service_id = $1 GROUP BY status",
      [serviceId],
    )

    const feedbackRes = await pool.query(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as total_feedback FROM feedback WHERE service_id = $1",
      [serviceId],
    )

    return {
      applications: applicationsRes.rows,
      avgRating: feedbackRes.rows[0]?.avg_rating || 0,
      totalFeedback: Number.parseInt(feedbackRes.rows[0]?.total_feedback) || 0,
    }
  }

  return {
    applications: [],
    avgRating: 0,
    totalFeedback: 0,
  }
}

async function createService(data) {
  const serviceId = data.service_id || `srv_${uuidv4().slice(0, 8)}`

  if (process.env.POSTGRES_CONN_STRING) {
    const sql = `
      INSERT INTO services (service_id, category, name, description, responsible_agency, estimated_processing_time, service_fee, requirements, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now(), now())
      RETURNING *
    `
    const values = [
      serviceId,
      data.category,
      data.name,
      data.description || "",
      data.responsible_agency || "",
      data.estimated_processing_time || "Not specified",
      data.service_fee || 0,
      data.requirements || [],
    ]
    const res = await pool.query(sql, values)
    return res.rows[0]
  }

  const newService = {
    service_id: serviceId,
    category: data.category,
    name: data.name,
    description: data.description || "",
    responsible_agency: data.responsible_agency || "",
    estimated_processing_time: data.estimated_processing_time || "Not specified",
    service_fee: data.service_fee || 0,
    requirements: data.requirements || [],
    is_archived: false,
  }

  loadSeed()
  memoryStore.push(newService)
  return newService
}

async function updateService(serviceId, data) {
  if (process.env.POSTGRES_CONN_STRING) {
    const fields = []
    const values = []
    let paramIndex = 1

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`)
      values.push(data.name)
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`)
      values.push(data.description)
    }
    if (data.category !== undefined) {
      fields.push(`category = $${paramIndex++}`)
      values.push(data.category)
    }
    if (data.responsible_agency !== undefined) {
      fields.push(`responsible_agency = $${paramIndex++}`)
      values.push(data.responsible_agency)
    }
    if (data.estimated_processing_time !== undefined) {
      fields.push(`estimated_processing_time = $${paramIndex++}`)
      values.push(data.estimated_processing_time)
    }
    if (data.service_fee !== undefined) {
      fields.push(`service_fee = $${paramIndex++}`)
      values.push(data.service_fee)
    }
    if (data.requirements !== undefined) {
      fields.push(`requirements = $${paramIndex++}`)
      values.push(data.requirements)
    }
    if (data.is_archived !== undefined) {
      fields.push(`is_archived = $${paramIndex++}`)
      values.push(data.is_archived)
    }

    if (fields.length === 0) {
      return null
    }

    fields.push(`updated_at = now()`)
    values.push(serviceId)

    const sql = `UPDATE services SET ${fields.join(", ")} WHERE service_id = $${paramIndex} RETURNING *`
    const res = await pool.query(sql, values)
    return res.rows[0]
  }

  loadSeed()
  const index = memoryStore.findIndex((s) => s.service_id === serviceId)
  if (index === -1) return null

  memoryStore[index] = { ...memoryStore[index], ...data }
  return memoryStore[index]
}

async function archiveService(serviceId) {
  return updateService(serviceId, { is_archived: true })
}

async function bulkOperation(action, serviceIds) {
  if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
    throw new Error("serviceIds must be a non-empty array")
  }

  if (action === "archive") {
    if (process.env.POSTGRES_CONN_STRING) {
      const placeholders = serviceIds.map((_, i) => `$${i + 1}`).join(",")
      const sql = `UPDATE services SET is_archived = true, updated_at = now() WHERE service_id IN (${placeholders}) RETURNING *`
      const res = await pool.query(sql, serviceIds)
      return { updated: res.rowCount, services: res.rows }
    }

    loadSeed()
    const updated = []
    serviceIds.forEach((id) => {
      const service = memoryStore.find((s) => s.service_id === id)
      if (service) {
        service.is_archived = true
        updated.push(service)
      }
    })
    return { updated: updated.length, services: updated }
  }

  if (action === "unarchive") {
    if (process.env.POSTGRES_CONN_STRING) {
      const placeholders = serviceIds.map((_, i) => `$${i + 1}`).join(",")
      const sql = `UPDATE services SET is_archived = false, updated_at = now() WHERE service_id IN (${placeholders}) RETURNING *`
      const res = await pool.query(sql, serviceIds)
      return { updated: res.rowCount, services: res.rows }
    }

    loadSeed()
    const updated = []
    serviceIds.forEach((id) => {
      const service = memoryStore.find((s) => s.service_id === id)
      if (service) {
        service.is_archived = false
        updated.push(service)
      }
    })
    return { updated: updated.length, services: updated }
  }

  throw new Error(`Invalid action: ${action}`)
}

module.exports = {
  listServices,
  getServiceById,
  createService,
  updateService,
  archiveService,
  getCategories,
  searchServices,
  getServiceStats,
  bulkOperation,
}
