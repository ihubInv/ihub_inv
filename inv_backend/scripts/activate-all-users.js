const mongoose = require("mongoose")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Import User model
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    department: String,
    position: String,
    joinDate: Date,
    profileImage: String,
    isActive: Boolean,
  }),
)

// Function to activate all users
const activateAllUsers = async () => {
  try {
    // Update all users to be active
    const result = await User.updateMany(
      {}, // Empty filter to match all documents
      { isActive: true },
    )

    console.log(`Updated ${result.modifiedCount} users to active status`)

    // Verify superadmin and admin are active
    const superadmin = await User.findOne({ email: "superadmin@ihub.com" })
    const admin = await User.findOne({ email: "admin@ihub.com" })

    console.log("Superadmin active status:", superadmin ? superadmin.isActive : "Not found")
    console.log("Admin active status:", admin ? admin.isActive : "Not found")

    console.log("All users activated successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error activating users:", error)
    process.exit(1)
  }
}

// Run the function
activateAllUsers()

