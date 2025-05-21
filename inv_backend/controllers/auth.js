const Auth = require("../models/auth")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")



exports.register = async (req, res) => {
  try {
    const { name, email, password, role, superAdminKey, masterKey, adminKey,department, position } = req.body;

    // Role-based security key validation
    if (role === "superadmin") {
      if (superAdminKey !== "SUPERADMIN_REGISTRATION_KEY") {
        return res.status(401).json({ success: false, message: "Invalid superadmin key" });
      }
      if (masterKey !== "MASTER_SECURITY_KEY") {
        return res.status(401).json({ success: false, message: "Invalid master security key" });
      }
      // if (password.length < 8) {
      //   return res.status(400).json({ success: false, message: "Superadmin password must be at least 8 characters" });
      // }
    } else if (role === "admin") {
      if (adminKey !== "ADMIN_REGISTRATION_KEY") {
        return res.status(401).json({ success: false, message: "Invalid admin key" });
      }
    }

    // Check if user already exists
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create user
    const user = await Auth.create({ name, email, password, role: role ,department:department, position:position || "user" });

    // JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, "ergbejrwbreegbrkwgergt", { expiresIn: "1h" });

    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department,position },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check for user
    const user = await Auth.findOne({ email }).select("+password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if password matches
    // const isMatch = await user.matchPassword(password)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // if (!isMatch) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid credentials",
    //   })
    // }

    // Generate token
    // const token = generateToken(user._id)
    const token = jwt.sign(
      { id: user._id,  },
      "ergbejrwbreegbrkwgergt",
      { expiresIn: '1h' }
    );
    res.status(200).json({
      success: true,
      token:token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
        // joinDate: user.joinDate,
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



exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Auth not authenticated' });
    }

    const user = await Auth.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Auth not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
        // joinDate: user.joinDate,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("getMe Error:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
