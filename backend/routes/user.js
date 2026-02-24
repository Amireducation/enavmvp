const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middleware/auth");

router.get("/profile", authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
