const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getDashboardSummary,
  getMonthlyAssets,
  getAssetAllocation,
  getAssetCategoryDistribution,
  getRecentTransactions,
  getCategoryBreakdown,
} = require("../controllers/dashboard");

const router = express.Router();

// Protect all dashboard routes, admin/superadmin only
router.use(protect);
router.use(authorize("admin", "superadmin"));

// Dashboard summary route
router.get("/summary", getDashboardSummary);
router.get("/monthly-assets", getMonthlyAssets);
router.get("/asset-allocation", getAssetAllocation);
router.get("/asset-category-distribution", getAssetCategoryDistribution);
router.get("/recent-transactions", getRecentTransactions);
router.get("/category-breakdown", getCategoryBreakdown);

module.exports = router;
