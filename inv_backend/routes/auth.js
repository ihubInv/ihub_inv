// const express = require("express")
// const { register, registerAdmin, registerSuperAdmin, login, getMe } = require("../controllers/auth")
// const { protect } = require("../middleware/auth")

// const router = express.Router()

// // Public routes
// router.post("/register", register)
// router.post("/register-superadmin", registerSuperAdmin)
// router.post("/login", login)

// // Protected routes
// router.use(protect)
// router.get("/me", getMe)

// // Superadmin routes
// router.post("/register-admin",  registerAdmin)
// // authorize("superadmin"),
// module.exports = router


// const express = require("express");
// const {
//   register,
//   registerAdmin,
//   registerSuperAdmin,
//   login,
//   getMe
// } = require("../controllers/auth");
// const { protect, authorize } = require("../middleware/auth");

// const router = express.Router();

// // Public routes
// router.post("/register", register); // Standard user
// router.post("/register-superadmin", registerSuperAdmin); // Initial setup only
// router.post("/login", login);

// // Protected route to get logged-in user info
// router.get("/me", protect, getMe);

// // Admin creation (protected, only superadmin can do this)
// router.post(
//   "/register-admin",
//   protect,
//   authorize("superadmin"),
//   registerAdmin
// );

// module.exports = router;




const express = require("express");
const {
  register,
  login,
  getMe
} = require("../controllers/auth");

const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", register); // Unified for user, admin, superadmin
router.post("/login", login);

// Protected route to get logged-in user info
router.get("/me", protect, getMe);



module.exports = router;
