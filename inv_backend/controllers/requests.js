const Request = require("../models/Request")
// const User = require("../models/User")
// const Auth = require("../models/auth")
// @desc    Create new request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res) => {
  try {
    // Add user to req.body
    req.body.userId = req.user.id

    const request = await Request.create(req.body)

    res.status(201).json({
      success: true,
      data: request,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private/Admin
exports.getRequests = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { status, urgency, itemType, startDate, endDate, search } = req.query

    // Build filter object
    const filter = {}

    // For regular users, only return their requests
    if (req.user.role === "user") {
      filter.userId = req.user.id
    }

    // Add filters based on query parameters
    if (status) filter.status = status
    if (urgency) filter.urgency = urgency
    if (itemType) filter.itemType = itemType

    // Date range filter
    if (startDate || endDate) {
      filter.requestDate = {}
      if (startDate) filter.requestDate.$gte = new Date(startDate)
      if (endDate) {
        const endDateObj = new Date(endDate)
        endDateObj.setHours(23, 59, 59, 999)
        filter.requestDate.$lte = endDateObj
      }
    }

    // Search filter
    if (search) {
      filter.$or = [
        { itemName: { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } },
        { additionalInfo: { $regex: search, $options: "i" } },
      ]
    }

    // For admin/superadmin, return all requests based on filters
    const requests = await Request.find(filter)
      .populate("userId", "name email department position")
      .populate("responseBy", "name email")
      .sort("-createdAt")

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// // @desc    Get single request
// // @route   GET /api/requests/:id
// // @access  Private
// exports.getRequest = async (req, res) => {
//   try {
//     const request = await Request.findById(req.params.id)
//       .populate("userId", "name email department position")
//       .populate("responseBy", "name email")

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "Request not found",
//       })
//     }

//     // Make sure user is request owner or admin/superadmin
//     if (request.userId.toString() !== req.user.id && req.user.role !== "admin" && req.user.role !== "superadmin") {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to access this request",
//       })
//     }

//     res.status(200).json({
//       success: true,
//       data: request,
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     })
//   }
// }





// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
exports.getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("userId", "_id name email department position") // ✅ include _id explicitly
      .populate("responseBy", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // ✅ Check if userId is populated and validate access
    const populatedUserId = request.userId && request.userId._id?.toString();

    if (
      !populatedUserId ||
      (populatedUserId !== req.user.id &&
        req.user.role !== "admin" &&
        req.user.role !== "superadmin")
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this request",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("❌ Error in getRequest:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};




// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Private/Admin
exports.updateRequest = async (req, res) => {
  try {
    let request = await Request.findById(req.params.id)

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      })
    }

    // Make sure user is admin/superadmin
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this request",
      })
    }

    // Add response date and responder
    if (req.body.status === "approved" || req.body.status === "rejected") {
      req.body.responseDate = Date.now()
      req.body.responseBy = req.user.id
    }

    request = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "name email department position")
      .populate("responseBy", "name email")

    res.status(200).json({
      success: true,
      data: request,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private/Admin
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      })
    }

    // Make sure user is admin/superadmin
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this request",
      })
    }

    await request.deleteOne()

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

// @desc    Get user requests
// @route   GET /api/requests/user
// @access  Private
exports.getUserRequests = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { status, urgency, itemType, startDate, endDate, search } = req.query

    // Build filter object
    const filter = { userId: req.user.id }

    // Add filters based on query parameters
    if (status) filter.status = status
    if (urgency) filter.urgency = urgency
    if (itemType) filter.itemType = itemType

    // Date range filter
    if (startDate || endDate) {
      filter.requestDate = {}
      if (startDate) filter.requestDate.$gte = new Date(startDate)
      if (endDate) {
        const endDateObj = new Date(endDate)
        endDateObj.setHours(23, 59, 59, 999)
        filter.requestDate.$lte = endDateObj
      }
    }

    // Search filter
    if (search) {
      filter.$or = [
        { itemName: { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } },
        { additionalInfo: { $regex: search, $options: "i" } },
      ]
    }

    const requests = await Request.find(filter).populate("responseBy", "name email").sort("-createdAt")

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Approve request
// @route   PUT /api/requests/:id/approve
// @access  Private/Admin
exports.approveRequest = async (req, res) => {
  try {
    let request = await Request.findById(req.params.id)

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      })
    }

    // Make sure user is admin/superadmin
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to approve this request",
      })
    }

    // Update request
    const updateData = {
      status: "approved",
      responseDate: Date.now(),
      responseBy: req.user.id,
      responseNote: req.body.responseNote || "",
      specifications: req.body.specifications || {},
    }

    request = await Request.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "name email department position")
      .populate("responseBy", "name email")

    res.status(200).json({
      success: true,
      data: request,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Reject request
// @route   PUT /api/requests/:id/reject
// @access  Private/Admin
exports.rejectRequest = async (req, res) => {
  try {
    let request = await Request.findById(req.params.id)

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      })
    }

    // Make sure user is admin/superadmin
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to reject this request",
      })
    }

    // Update request
    const updateData = {
      status: "rejected",
      responseDate: Date.now(),
      responseBy: req.user.id,
      responseNote: req.body.responseNote || "",
    }

    request = await Request.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "name email department position")
      .populate("responseBy", "name email")

    res.status(200).json({
      success: true,
      data: request,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Get request statistics
// @route   GET /api/requests/stats
// @access  Private/Admin
exports.getRequestStats = async (req, res) => {
  try {
    // Make sure user is admin/superadmin
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access request statistics",
      })
    }

    // Get counts by status
    const statusCounts = await Request.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])

    // Get counts by item type
    const typeCounts = await Request.aggregate([{ $group: { _id: "$itemType", count: { $sum: 1 } } }])

    // Get counts by urgency
    const urgencyCounts = await Request.aggregate([{ $group: { _id: "$urgency", count: { $sum: 1 } } }])

    // Get monthly request counts for the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyRequests = await Request.aggregate([
      {
        $match: {
          requestDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$requestDate" },
            month: { $month: "$requestDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    res.status(200).json({
      success: true,
      data: {
        statusCounts: statusCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count
          return acc
        }, {}),
        typeCounts: typeCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count
          return acc
        }, {}),
        urgencyCounts: urgencyCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count
          return acc
        }, {}),
        monthlyRequests,
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

