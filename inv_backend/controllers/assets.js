const Asset = require("../models/Asset")
const Category = require("../models/Category")

// @desc    Create new asset
// @route   POST /api/assets
// @access  Private/Admin
exports.createAsset = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id

    const asset = await Asset.create(req.body)

    res.status(201).json({
      success: true,
      data: asset,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Get all assets
// @route   GET /api/assets
// @access  Private/Admin
exports.getAssets = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const {
      category,
      status,
      minValue,
      maxValue,
      minPurchaseDate,
      maxPurchaseDate,
      search,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = req.query

    // Build filter object
    const filter = {}

    // Add filters based on query parameters
    if (category) filter.category = category
    if (status) filter.status = status

    // Value range filter
    if (minValue || maxValue) {
      filter.value = {}
      if (minValue) filter.value.$gte = Number(minValue)
      if (maxValue) filter.value.$lte = Number(maxValue)
    }

    // Purchase date range filter
    if (minPurchaseDate || maxPurchaseDate) {
      filter.purchaseDate = {}
      if (minPurchaseDate) filter.purchaseDate.$gte = new Date(minPurchaseDate)
      if (maxPurchaseDate) {
        const maxDate = new Date(maxPurchaseDate)
        maxDate.setHours(23, 59, 59, 999)
        filter.purchaseDate.$lte = maxDate
      }
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { serialNumber: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
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
    const total = await Asset.countDocuments(filter)

    // Get assets with pagination, sorting and filtering
    const assets = await Asset.find(filter)
      .populate("Category", "name")
      .populate("CreatedBy", "name")
      .populate("AssignedTo", "name email department position")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))

    res.status(200).json({
      success: true,
      count: assets.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
      data: assets,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Get single asset
// @route   GET /api/assets/:id
// @access  Private/Admin
exports.getAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("Category", "name")
      .populate("CreatedBy", "name")
      .populate("AssignedTo", "name email department position")

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      })
    }

    res.status(200).json({
      success: true,
      data: asset,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private/Admin
exports.updateAsset = async (req, res) => {
  try {
    let asset = await Asset.findById(req.params.id)

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      })
    }

    // Add updatedBy field
    req.body.updatedBy = req.user.id
    req.body.lastUpdated = Date.now()

    asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("Category", "name")
      .populate("CreatedBy", "name")
      .populate("AssignedTo", "name email department position")

    res.status(200).json({
      success: true,
      data: asset,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private/Admin
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      })
    }

    await asset.deleteOne()

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

// @desc    Assign asset to user
// @route   PUT /api/assets/:id/assign
// @access  Private/Admin
exports.assignAsset = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a user ID",
      })
    }

    let asset = await Asset.findById(req.params.id)

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      })
    }

    // Update asset
    const updateData = {
      AssignedTo: userId,
      Status: "assigned",
      LastUpdated: Date.now(),
      UpdatedBy: req.user.id,
    }

    asset = await Asset.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("Category", "name")
      .populate("CreatedBy", "name")
      .populate("AssignedTo", "name email department position")

    res.status(200).json({
      success: true,
      data: asset,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Unassign asset from user
// @route   PUT /api/assets/:id/unassign
// @access  Private/Admin
exports.unassignAsset = async (req, res) => {
  try {
    let asset = await Asset.findById(req.params.id)

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      })
    }

    // Update asset
    const updateData = {
      AssignedTo: null,
      Status: "available",
      LastUpdated: Date.now(),
      UpdatedBy: req.user.id,
    }

    asset = await Asset.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("Category", "name")
      .populate("CreatedBy", "name")

    res.status(200).json({
      success: true,
      data: asset,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

// @desc    Get asset statistics
// @route   GET /api/assets/stats
// @access  Private/Admin
exports.getAssetStats = async (req, res) => {
  try {
    // Get counts by status
    const statusCounts = await Asset.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])

    // Get counts by category
    const categoryCounts = await Asset.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }])

    // Get total value of assets
    const valueStats = await Asset.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: "$value" },
          avgValue: { $avg: "$value" },
          minValue: { $min: "$value" },
          maxValue: { $max: "$value" },
        },
      },
    ])

    // Get category names for the category counts
    const categoryIds = categoryCounts.map((cat) => cat._id)
    const categories = await Category.find({ _id: { $in: categoryIds } })

    const categoryData = categoryCounts.map((cat) => {
      const categoryInfo = categories.find((c) => c._id.toString() === cat._id.toString())
      return {
        _id: cat._id,
        name: categoryInfo ? categoryInfo.name : "Unknown",
        count: cat.count,
      }
    })

    res.status(200).json({
      success: true,
      data: {
        statusCounts: statusCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count
          return acc
        }, {}),
        categoryCounts: categoryData,
        valueStats: valueStats[0] || { totalValue: 0, avgValue: 0, minValue: 0, maxValue: 0 },
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





// @desc    Bulk upload assets from Excel
// @route   POST /api/assets/bulk-upload
// @access  Private/Admin
exports.bulkUploadAssets = async (req, res) => {
  try {
    const data = req.body; // Array of asset rows from parsed Excel

    // Step 1: Get unique category names from the data
    const uniqueCategoryNames = [...new Set(data.map(row => row.Category?.trim()).filter(Boolean))];

    // Step 2: Fetch category documents
    const categories = await Category.find({ name: { $in: uniqueCategoryNames } });

    // Step 3: Map category names to ObjectIds
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Step 4: Prepare asset documents with converted category IDs
    const assets = data.map(row => ({
      AssetName: row.AssetName,
      // SimilarName: row.SimilarName,
      InvoiceNumber: row.InvoiceNumber,
      IssuedTo: row.IssuedTo,
      // Make: row.Make,
      Model: row.Model,
      ProductSerialNumber: row.ProductSerialNumber,
      PurchaseDate: row.PurchaseDate ? new Date(row.PurchaseDate) : null,
      Quantity: Number(row.Quantity),
      RateIncludingTaxes: Number(row.RateIncludingTaxes),
      SessionStartDate: row.SessionStartDate ? new Date(row.SessionStartDate) : null,
      SessionEndDate: row.SessionEndDate ? new Date(row.SessionEndDate) : null,
      VendorName: row.VendorName,
      UniID: row.UniID,
      Category: categoryMap[row.Category?.trim()] || null, // Convert name to ID
      CreatedBy: req.user?._id,
    })).filter(asset => asset.Category); // remove invalid ones without category match

    // Step 5: Save to DB
    await Asset.insertMany(assets);

    res.status(200).json({
      success: true,
      message: `${assets.length} assets uploaded successfully.`,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({
      success: false,
      message: "Bulk upload failed",
      error: error.message,
    });
  }
};
