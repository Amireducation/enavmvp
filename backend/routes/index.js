const express = require("express")
const router = express.Router()

const auth = require("./auth")
const users = require("./users")
const services = require("./services")
const serviceRequests = require("./serviceRequests")
const profile = require("./profile")
const applications = require("./applications")
const feedback = require("./feedback")
const notifications = require("./notifications")
const partners = require("./partners")
const analytics = require("./analytics")

router.use("/auth", auth)
router.use("/users", users)
router.use("/services", services)
router.use("/service-requests", serviceRequests)
router.use("/profile", profile)
router.use("/applications", applications)
router.use("/feedback", feedback)
router.use("/notifications", notifications)
router.use("/partners", partners)
router.use("/analytics", analytics)

router.get("/status", (req, res) => {
  res.json({ status: "ok" })
})

module.exports = router
