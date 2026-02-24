const express = require("express")
const router = express.Router()
const applicationModel = require("../models/application")
const { authenticateJWT } = require("../middleware/auth")
const pool = require("../config/db")

// Create new application
router.post("/", authenticateJWT, async (req, res, next) => {
  try {
    const { service_id, submitted_data } = req.body
    if (!service_id) {
      return res.status(400).json({ error: "service_id is required" })
    }

    const application = await applicationModel.createApplication({
      user_id: req.user.id,
      service_id,
      submitted_data,
    })

    res.status(201).json({ application })
  } catch (err) {
    next(err)
  }
})

// Get user's applications
router.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const applications = await applicationModel.listApplicationsByUser(req.user.id)
    res.json({ applications })
  } catch (err) {
    next(err)
  }
})

// Get application by ID
router.get("/:id", authenticateJWT, async (req, res, next) => {
  try {
    const application = await applicationModel.getApplicationById(req.params.id)
    if (!application) {
      return res.status(404).json({ error: "Application not found" })
    }
    // Check ownership
    if (application.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" })
    }
    res.json({ application })
  } catch (err) {
    next(err)
  }
})

router.get("/all", authenticateJWT, async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "employee") {
      return res.status(403).json({ error: "Insufficient permissions" })
    }

    const { status, service_id, startDate, endDate, page = 1, limit = 50 } = req.query

    const filters = {
      status,
      service_id,
      startDate,
      endDate,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    }

    const result = await applicationModel.listAllApplications(filters)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

// Update application status (admin only)
router.patch("/:id/status", authenticateJWT, async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "employee") {
      return res.status(403).json({ error: "Insufficient permissions" })
    }
    const { status } = req.body
    if (!status) {
      return res.status(400).json({ error: "status is required" })
    }
    const application = await applicationModel.updateApplicationStatus(req.params.id, status)
    res.json({ application })
  } catch (err) {
    next(err)
  }
})

module.exports = router
