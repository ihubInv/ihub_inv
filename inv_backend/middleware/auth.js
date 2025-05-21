
// const Auth = require("../models/Auth")
const Auth = require("../models/auth")
const jwt = require('jsonwebtoken');



// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `Auth role ${req.user.role} is not authorized to access this route`,
//       })
//     }
//     next()
//   }
// }






// exports.protect = async (req, res, next) => {
//   try {
//     const token = req.headers['authorization']?.split(' ')[1]; // Get token

//     if (!token) {
//       return res.status(403).json({ success: false, message: 'No token provided' });
//     }

//     console.log("TOKEN USED FOR AUTH:", token);

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "ergbejrwbreegbrkwgergt");
//     console.log("Decoded Token:", decoded);  // Debugging

//     // Attach full user object to req.user
//     const user = await Auth.findById(decoded.id).select('-password'); // Exclude password
//     if (!user) {
//       return res.status(401).json({ success: false, message: 'Auth not found' });
//     }

//     req.user = user; // Now req.user.id, req.user.role, etc., will work
//     next();
//   } catch (error) {
//     console.error("JWT Verification Error:", error);
//     res.status(401).json({ success: false, message: 'Invalid or expired token' });
//   }
// };


exports.protect = async (req, res, next) => {
  
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ success: false, message: 'No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    // console.log("TOKEN USED FOR AUTH:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ergbejrwbreegbrkwgergt");

    const user = await Auth.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your token is expired. Please re-login.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};



exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
