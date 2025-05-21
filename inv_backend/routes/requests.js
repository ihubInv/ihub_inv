const express = require("express")
const {
  createRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  getUserRequests,
  approveRequest,
  rejectRequest,
  getRequestStats,
} = require("../controllers/requests")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Protected routes
router.use(protect)

// User routes
router.route("/").post(createRequest).get(getRequests)
router.route("/user").get(getUserRequests)
router.route("/stats").get(authorize("admin", "superadmin"), getRequestStats)

router
  .route("/:id")
  .get(getRequest)
  .put(authorize("admin", "superadmin"), updateRequest)
  .delete(authorize("admin", "superadmin"), deleteRequest)

router.route("/:id/approve").put(authorize("admin", "superadmin"), approveRequest)

router.route("/:id/reject").put(authorize("admin", "superadmin"), rejectRequest)

module.exports = router

