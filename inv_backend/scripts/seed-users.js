const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Import User model
const User = require("../models/User")

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Create superadmin and admin users
const createUsers = async () => {
  try {
    // Check if superadmin already exists
    const superadminExists = await User.findOne({ email: "superadmin@ihub.com" })

    if (!superadminExists) {
      // Create superadmin
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash("Superadmin@123", salt)

      const superadmin = new User({
        name: "Super Admin",
        email: "superadmin@ihub.com",
        password: hashedPassword,
        role: "superadmin",
        department: "IT",
        position: "System Administrator",
        joinDate: new Date(),
      })

      await superadmin.save()
      console.log("Superadmin created successfully")
    } else {
      console.log("Superadmin already exists")
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@ihub.com" })

    if (!adminExists) {
      // Create admin
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash("Admin@123", salt)

      const admin = new User({
        name: "Admin User",
        email: "admin@ihub.com",
        password: hashedPassword,
        role: "admin",
        department: "Operations",
        position: "Inventory Manager",
        joinDate: new Date(),
      })

      await admin.save()
      console.log("Admin created successfully")
    } else {
      console.log("Admin already exists")
    }

    console.log("Database seeding completed")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

// Run the function
createUsers()

