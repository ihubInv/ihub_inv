const User = require("../models/User")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, department, position } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      })
    }

    // Create user
    user = new User({
      name,
      email,
      password,
      department,
      position,
      role: "user", // Default role
    })

    // Save user
    await user.save()

    // Create token
    const token = jwt.sign({ id: user._id }, "ergbejrwbreegbrkwgergt", { expiresIn: "30d" })

    res.status(201).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact an administrator.",
      })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Create token
    const token = jwt.sign({ id: user._id }, "ergbejrwbreegbrkwgergt", { expiresIn: "30d" })

    res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { role, isActive, department, search, sortBy, sortOrder, page = 1, limit = 10 } = req.query

    // Build filter object
    const filter = {}

    // Add filters based on query parameters
    if (role) filter.role = role
    if (isActive !== undefined) filter.isActive = isActive === "true"
    if (department) filter.department = department

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
      ]
    }

    // Build sort object
    const sort = {}
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1
    } else {
      sort.createdAt = -1 // Default sort by creation date, newest first
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit)

    // Get total count for pagination
    const total = await User.countDocuments(filter)

    // Get users with pagination, sorting and filtering
    const users = await User.find(filter).sort(sort).skip(skip).limit(Number(limit))

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
      data: users,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    // Make sure user is superadmin for role changes
    if (req.body.role && req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only superadmins can change user roles",
      })
    }

    let user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Prevent superadmin from being downgraded by another superadmin
    if (user.role === "superadmin" && req.body.role && req.body.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot downgrade a superadmin",
      })
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Prevent superadmin from being deleted by another superadmin
    if (user.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete a superadmin",
      })
    }

    await user.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, department, position, currentPassword, newPassword } = req.body

    // Build update object
    const updateFields = {}
    if (name) updateFields.name = name
    if (email) updateFields.email = email
    if (department) updateFields.department = department
    if (position) updateFields.position = position

    // If user wants to change password
    if (currentPassword && newPassword) {
      // Get user with password
      const user = await User.findById(req.user.id).select("+password")

      // Check current password
      const isMatch = await user.matchPassword(currentPassword)

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        })
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10)
      updateFields.password = await bcrypt.hash(newPassword, salt)
    }

    // Update user
    const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check current password
    const { currentPassword, newPassword } = req.body

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Change user role
// @route   PUT /api/users/:id/role
// @access  Private/Superadmin
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Please provide a role",
      })
    }

    // Validate role
    if (!["user", "admin", "superadmin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      })
    }

    let user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Prevent superadmin from being downgraded by another superadmin
    if (user.role === "superadmin" && role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot downgrade a superadmin",
      })
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      {
        new: true,
        runValidators: true,
      },
    )

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Activate/Deactivate user
// @route   PUT /api/users/:id/status
// @access  Private/Admin
exports.changeUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide isActive status",
      })
    }

    let user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Prevent superadmin from being deactivated by an admin
    if (user.role === "superadmin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only superadmins can change superadmin status",
      })
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      {
        new: true,
        runValidators: true,
      },
    )

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

