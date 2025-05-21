const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Protected routes for all users
router.use(protect);

// List all categories
router.get("/", getCategories);

// Create new category (admin only)
router.post("/", authorize("admin", "superadmin"), createCategory);


// Get single category by ID
router.get("/:id", getCategory);

// Update/delete category by ID (admin only)
router.put("/:id", authorize("admin", "superadmin"), updateCategory);
router.delete("/:id", authorize("admin", "superadmin"), deleteCategory);

module.exports = router;

