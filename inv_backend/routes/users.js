const express = require("express")
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changeUserRole,
  changeUserStatus,
} = require("../controllers/users")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Public routes
router.post("/register", registerUser)
router.post("/login", loginUser)

// Protected routes
router.use(protect)

// User routes
router.get("/me", getMe)
router.put("/profile", updateProfile)

// Admin routes
router.use(authorize("admin", "superadmin"))
router.get("/", getUsers)

router.route("/:id").get(getUser).put(updateUser).delete(authorize("superadmin"), deleteUser)

router.put("/:id/role", authorize("superadmin"), changeUserRole)
router.put("/:id/status", changeUserStatus)

module.exports = router

