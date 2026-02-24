const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")
const fs = require("fs")
const path = require("path")
const serviceModel = require("./service")

// For local fallback, persist to a file so restarts keep data during dev
const fallbackPath = path.join(__dirname, "..", "data", "serviceRequests.memory.json")
let memoryRequests = null

function loadMemory() {
  if (memoryRequests === null) {
    try {
      const raw = fs.readFileSync(fallbackPath, "utf8")
      memoryRequests = JSON.parse(raw)
    } catch (e) {
      memoryRequests = []
    }
  }
}

function saveMemory() {
  try {
    fs.writeFileSync(fallbackPath, JSON.stringify(memoryRequests, null, 2), "utf8")
  } catch (e) {
    // ignore
  }
}

async function createRequest(data) {
  const req = {
    request_id: uuidv4(),
    user_id: data.user_id,
    service_name: data.service_name,
    service_description: data.service_description || null,
    category_suggestion: data.category_suggestion || null,
    justification: data.justification || null,
    status: data.status || "submitted",
    priority: data.priority || "medium",
    created_at: new Date().toISOString(),
  }

  if (process.env.POSTGRES_CONN_STRING) {
    const sql = `INSERT INTO service_requests(request_id, user_id, service_name, service_description, category_suggestion, justification, status, priority, created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`
    const values = [
      req.request_id,
      req.user_id,
      req.service_name,
      req.service_description,
      req.category_suggestion,
      req.justification,
      req.status,
      req.priority,
      req.created_at,
    ]
    const res = await pool.query(sql, values)
    return res.rows[0]
  }

  loadMemory()
  memoryRequests.push(req)
  saveMemory()
  return req
}

async function listRequests(statusFilter) {
  if (process.env.POSTGRES_CONN_STRING) {
    let query = "SELECT * FROM service_requests"
    const params = []
    if (statusFilter) {
      query += " WHERE status = $1"
      params.push(statusFilter)
    }
    query += " ORDER BY created_at DESC"
    const res = await pool.query(query, params)
    return res.rows
  }
  loadMemory()
  if (statusFilter) {
    return memoryRequests.filter((r) => r.status === statusFilter)
  }
  return memoryRequests
}

async function getRequestById(requestId) {
  if (process.env.POSTGRES_CONN_STRING) {
    const res = await pool.query("SELECT * FROM service_requests WHERE request_id = $1", [requestId])
    return res.rows[0]
  }
  loadMemory()
  return memoryRequests.find((r) => r.request_id === requestId)
}

async function updateRequest(requestId, updates) {
  if (process.env.POSTGRES_CONN_STRING) {
    const fields = []
    const values = []
    let paramIndex = 1

    if (updates.status) {
      fields.push(`status = $${paramIndex++}`)
      values.push(updates.status)
    }
    if (updates.priority) {
      fields.push(`priority = $${paramIndex++}`)
      values.push(updates.priority)
    }

    if (fields.length === 0) return null

    fields.push(`updated_at = now()`)
    values.push(requestId)

    const sql = `UPDATE service_requests SET ${fields.join(", ")} WHERE request_id = $${paramIndex} RETURNING *`
    const res = await pool.query(sql, values)
    return res.rows[0]
  }

  loadMemory()
  const request = memoryRequests.find((r) => r.request_id === requestId)
  if (!request) return null

  Object.assign(request, updates)
  saveMemory()
  return request
}

async function approveAndCreateService(requestId, serviceData) {
  const request = await getRequestById(requestId)
  if (!request) {
    throw new Error("Request not found")
  }

  // Create the service
  const newService = await serviceModel.createService({
    category: serviceData.category || request.category_suggestion || "General",
    name: serviceData.name || request.service_name,
    description: serviceData.description || request.service_description,
    responsible_agency: serviceData.responsible_agency || "Not specified",
    estimated_processing_time: serviceData.estimated_processing_time || "TBD",
    service_fee: serviceData.service_fee || 0,
    requirements: serviceData.requirements || [],
  })

  // Update request status to approved
  await updateRequest(requestId, { status: "approved" })

  return {
    message: "Service request approved and service created",
    service: newService,
    request,
  }
}

module.exports = {
  createRequest,
  listRequests,
  getRequestById,
  updateRequest,
  approveAndCreateService,
}
