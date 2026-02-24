const express = require("express")
const cors = require("cors")
const routes = require("./routes")
const errorHandler = require("./middleware/error")
const { loadSecrets } = require("./config/secrets")

require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

app.use(async (req, res, next) => {
  if (!req.app.locals.secretsLoaded) {
    try {
      await loadSecrets()
      req.app.locals.secretsLoaded = true
      console.log("[Startup] Secrets loaded successfully")
    } catch (error) {
      console.error("[Startup] Failed to load secrets:", error.message)
      // Continue with fallback to .env
    }
  }
  next()
})

app.use("/api", routes)
app.get("/", (req, res) => res.send("Ethiopian Navigator Backend is live"))
app.use(errorHandler)

const PORT = process.env.PORT || 5000

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`API Documentation: http://localhost:${PORT}/api/status`)
    console.log(
      `Endpoints: /api/auth, /api/services, /api/applications, /api/feedback, /api/notifications, /api/profile`,
    )
  })
}

module.exports = app
