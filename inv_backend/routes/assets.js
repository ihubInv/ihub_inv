// const express = require("express")
// const {
//   createAsset,
//   getAssets,
//   getAsset,
//   updateAsset,
//   deleteAsset,
//   assignAsset,
//   unassignAsset,
//   getAssetStats,
// } = require("../controllers/assets")
// const { protect, authorize } = require("../middleware/auth")

// const router = express.Router()

// // Protected routes
// router.use(protect)
// router.use(authorize("admin", "superadmin"))

// router.route("/").post(createAsset).get(getAssets)
// router.route("/stats").get(getAssetStats)

// router.route("/:id").get(getAsset).put(updateAsset).delete(deleteAsset)

// router.route("/:id/assign").put(assignAsset)
// router.route("/:id/unassign").put(unassignAsset)

// module.exports = router






const express = require("express");
const {
  createAsset,
  getAssets,
  getAsset,
  updateAsset,
  deleteAsset,
  assignAsset,
  unassignAsset,
  getAssetStats,
  bulkUploadAssets,
} = require("../controllers/assets");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Protected routes
router.use(protect);
router.use(authorize("admin", "superadmin"));

// Non-dynamic routes must come first to avoid being treated as ":id"
router.route("/stats").get(getAssetStats);

// Stub for /categories to prevent CastError
router.get("/categories", (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented" });
});

// Main CRUD routes
router.route("/")
  .get(getAssets)         // Get all assets
  .post(createAsset);     // Create new asset

// Assignment routes
router.route("/:id/assign").put(assignAsset);
router.route("/:id/unassign").put(unassignAsset);


// bulk upload
router.route("/bulk-upload").post(bulkUploadAssets);

router.route("/:id")
  .get(getAsset)          // Get single asset
  .put(updateAsset)       // Update asset
  .delete(deleteAsset);   // Delete asset

module.exports = router;
