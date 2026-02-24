import request from "supertest"
import app from "../server"
import pool from "../config/db"

describe("Ethiopian Navigator API Integration Tests", () => {
  let token: string
  let userId: number
  const testUser = {
    email: "test@example.com",
    password: "TestPassword123!",
  }

  beforeAll(async () => {
    // Clean up test data
    await pool.query("DELETE FROM users WHERE email = $1", [testUser.email])
  })

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [testUser.email])
    await pool.end()
  })

  describe("Authentication", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...testUser, role: "citizen" })

      expect(res.status).toBe(201)
      expect(res.body.message).toBe("User registered")
    })

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send(testUser)

      expect(res.status).toBe(200)
      expect(res.body.token).toBeDefined()
      token = res.body.token
    })

    it("should reject invalid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({ email: testUser.email, password: "wrong" })

      expect(res.status).toBe(401)
    })
  })

  describe("Services API", () => {
    it("should list all services", async () => {
      const res = await request(app).get("/api/services")

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.services)).toBe(true)
    })

    it("should get service by ID", async () => {
      const res = await request(app).get("/api/services/srv_001")

      expect(res.status).toBe(200)
      expect(res.body.service).toBeDefined()
    })
  })

  describe("Applications API", () => {
    it("should create application", async () => {
      const res = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${token}`)
        .send({
          service_id: "srv_001",
          submitted_data: { name: "Test User" },
        })

      expect(res.status).toBe(201)
      expect(res.body.application).toBeDefined()
    })

    it("should list user applications", async () => {
      const res = await request(app).get("/api/applications").set("Authorization", `Bearer ${token}`)

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.applications)).toBe(true)
    })
  })

  describe("Feedback API", () => {
    it("should submit feedback", async () => {
      const res = await request(app).post("/api/feedback").set("Authorization", `Bearer ${token}`).send({
        rating: 5,
        comments: "Excellent service",
      })

      expect(res.status).toBe(201)
      expect(res.body.feedback).toBeDefined()
    })
  })

  describe("Profile API", () => {
    it("should get user profile", async () => {
      const res = await request(app).get("/api/profile").set("Authorization", `Bearer ${token}`)

      expect(res.status).toBe(200)
      expect(res.body.user).toBeDefined()
    })
  })
})
