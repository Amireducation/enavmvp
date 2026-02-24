const express = require("express")
const router = express.Router()
const serviceModel = require("../models/service")
const { authenticateJWT, authorizeRoles } = require("../middleware/auth")

router.get("/", async (req, res, next) => {
  try {
    const { category, minFee, maxFee, search } = req.query
    const services = await serviceModel.listServices({ category, minFee, maxFee, search })
    res.json({ services })
  } catch (err) {
    next(err)
  }
})

router.get("/categories", async (req, res, next) => {
  try {
    const categories = await serviceModel.getCategories()
    res.json({ categories })
  } catch (err) {
    next(err)
  }
})

router.post("/search", async (req, res, next) => {
  try {
    const { query, category, minFee, maxFee, agency, sortBy } = req.body
    const services = await serviceModel.searchServices({ query, category, minFee, maxFee, agency, sortBy })
    res.json({ services })
  } catch (err) {
    next(err)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const svc = await serviceModel.getServiceById(req.params.id)
    if (!svc) return res.status(404).json({ error: "service not found" })
    res.json({ service: svc })
  } catch (err) {
    next(err)
  }
})

router.get("/:id/stats", authenticateJWT, authorizeRoles("admin", "employee"), async (req, res, next) => {
  try {
    const stats = await serviceModel.getServiceStats(req.params.id)
    res.json({ stats })
  } catch (err) {
    next(err)
  }
})

router.post("/", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const service = await serviceModel.createService(req.body)
    res.status(201).json({ service })
  } catch (err) {
    next(err)
  }
})

router.patch("/:id", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const service = await serviceModel.updateService(req.params.id, req.body)
    if (!service) {
      return res.status(404).json({ error: "Service not found" })
    }
    res.json({ service })
  } catch (err) {
    next(err)
  }
})

router.delete("/:id", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const service = await serviceModel.archiveService(req.params.id)
    if (!service) {
      return res.status(404).json({ error: "Service not found" })
    }
    res.json({ message: "Service archived successfully", service })
  } catch (err) {
    next(err)
  }
})

router.post("/bulk", authenticateJWT, authorizeRoles("admin"), async (req, res, next) => {
  try {
    const { action, serviceIds } = req.body
    if (!action || !serviceIds || !Array.isArray(serviceIds)) {
      return res.status(400).json({ error: "action and serviceIds array required" })
    }

    const result = await serviceModel.bulkOperation(action, serviceIds)
    res.json({ result })
  } catch (err) {
    next(err)
  }
})

module.exports = router
