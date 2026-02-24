const jwt = require("jsonwebtoken")
const { getSecret } = require("../config/secrets")

async function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: "Authorization header missing" })

    const token = authHeader.split(" ")[1]

    const jwtSecret = getSecret("jwtSecret")
    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT configuration missing" })
    }

    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid or expired token" })
      req.user = user
      next()
    })
  } catch (error) {
    next(error)
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthenticated" })
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" })
    next()
  }
}

module.exports = { authenticateJWT, authorizeRoles }
