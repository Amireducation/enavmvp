const express = require("express")
const router = express.Router()
const requestModel = require("../models/serviceRequest")
const { authenticateJWT, authorizeRoles } = require("../middleware/auth")

router.post("/", authenticateJWT, async (req, res, next) => {
  try {
    const { service_name, service_description, category_suggestion, justification } = req.body
    if (!service_name) {
      return res.status(400).json({ error: "service_name is required" })
    }
    const created = await requestModel.createRequest({
      user_id: req.user.id,
      service_name,
      service_description,
      category_suggestion,
      justification,
    })
    res.status(201).json({ request: created })
  } catch (err) {
    next(err)
  }
})

router.get("/", authenticateJWT, authorizeRoles("admin", "employee"), async (req, res, next) => {
  try {
    const { status } = req.query
    const items = await requestModel.listRequests(status)
    res.json({ requests: items })
  } catch (err) {
    next(err)
  }
})

router.get("/:id", authenticateJWT, async (req, res, next) => {
  try {
    const request = await requestModel.getRequestById(req.params.id)
    if (!request) {
      return res.status(404).json({ error: "Request not found" })
    }
    // Check ownership or admin/employee
    if (request.user_id !== req.user.id && req.user.role !== "admin" && req.user.role !== "employee") {
      return res.status(403).json({ error: "Forbidden" })
    }
    res.json({ request })
  } catch (err) {
    next(err)
  }
})

router.patch("/:id", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const { status, priority } = req.body
    const request = await requestModel.updateRequest(req.params.id, { status, priority })
    if (!request) {
      return res.status(404).json({ error: "Request not found" })
    }
    res.json({ request })
  } catch (err) {
    next(err)
  }
})

router.post("/:id/approve", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const serviceData = req.body
    const result = await requestModel.approveAndCreateService(req.params.id, serviceData)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
