const Asset = require("../models/Asset");
const Category = require("../models/Category");
const Request = require("../models/Request");
const User = require("../models/User");

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private/Admin
exports.getDashboardSummary = async (req, res) => {
  try {
    // Asset stats
    const assetCount = await Asset.countDocuments();
    const assetStats = await Asset.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: "$value" },
          avgValue: { $avg: "$value" },
        },
      },
    ]);

    // Request stats
    const requestCount = await Request.countDocuments();
    const requestStatusCounts = await Request.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // User stats
    const userCount = await User.countDocuments();
    const userRoleCounts = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        assets: {
          count: assetCount,
          totalValue: assetStats[0]?.totalValue || 0,
          avgValue: assetStats[0]?.avgValue || 0,
        },
        requests: {
          count: requestCount,
          statusCounts: requestStatusCounts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
        },
        users: {
          count: userCount,
          roleCounts: userRoleCounts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get monthly asset acquisition and value data
// @route   GET /api/dashboard/monthly-assets
// @access  Private/Admin
exports.getMonthlyAssets = async (req, res) => {
  try {
    // Get last 6 months
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }
    // Aggregate asset count and value per month
    const agg = await Asset.aggregate([
      {
        $match: {
          PurchaseDate: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$PurchaseDate" }, month: { $month: "$PurchaseDate" } },
          count: { $sum: 1 },
          value: { $sum: "$RateIncludingTaxes" },
        },
      },
    ]);
    // Map to months
    const monthLabels = months.map(m => new Date(m.year, m.month - 1).toLocaleString('default', { month: 'short' }));
    const acquisitions = months.map(m => {
      const found = agg.find(a => a._id.year === m.year && a._id.month === m.month);
      return found ? found.count : 0;
    });
    const values = months.map(m => {
      const found = agg.find(a => a._id.year === m.year && a._id.month === m.month);
      return found ? found.value : 0;
    });
    res.json({
      labels: monthLabels,
      datasets: [
        {
          label: "Asset Acquisitions",
          data: acquisitions,
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "rgba(59, 130, 246, 0.8)",
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: "Asset Value (₹ thousands)",
          data: values,
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderColor: "rgba(16, 185, 129, 0.8)",
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get asset allocation by department
// @route   GET /api/dashboard/asset-allocation
// @access  Private/Admin
exports.getAssetAllocation = async (req, res) => {
  try {
    // Group by IssuedTo (department)
    const agg = await Asset.aggregate([
      { $match: { IssuedTo: { $exists: true, $ne: null, $ne: "" } } },
      { $group: { _id: "$IssuedTo", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const labels = agg.map(a => a._id || "Unassigned");
    const data = agg.map(a => a.count);
    res.json({
      labels,
      datasets: [
        {
          label: "Allocated Assets",
          data,
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(236, 72, 153, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(239, 68, 68, 0.8)"
          ],
          borderWidth: 1,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get asset category distribution (bar chart)
// @route   GET /api/dashboard/asset-category-distribution
// @access  Private/Admin
exports.getAssetCategoryDistribution = async (req, res) => {
  try {
    // Join with Category and group by category name
    const agg = await Asset.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "Category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      { $group: { _id: "$categoryInfo.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const labels = agg.map(a => a._id);
    const data = agg.map(a => a.count);
    res.json({
      labels,
      datasets: [
        {
          label: "Asset Count",
          data,
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "rgba(59, 130, 246, 0.8)",
          borderWidth: 1,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get recent transactions
// @route   GET /api/dashboard/recent-transactions
// @access  Private/Admin
exports.getRecentTransactions = async (req, res) => {
  try {
    // Get 3 most recent assets
    const assets = await Asset.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("Category");
    const transactions = assets.map(a => ({
      title: `${a.Quantity || 1} ${a.AssetName} purchased`,
      date: a.PurchaseDate ? a.PurchaseDate.toLocaleDateString() : "Unknown",
      amount: a.RateIncludingTaxes || 0,
      category: a.Category?.name || "Unknown",
    }));
    res.json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get asset category breakdown
// @route   GET /api/dashboard/category-breakdown
// @access  Private/Admin
exports.getCategoryBreakdown = async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.find();
    // Get all assets
    const assets = await Asset.find().populate('Category');
    // Build breakdown
    const breakdown = categories.map(cat => {
      const catAssets = assets.filter(asset => String(asset.Category?._id) === String(cat._id));
      const tangibleAssets = catAssets.filter(asset => cat.type === 'Tangible');
      const intangibleAssets = catAssets.filter(asset => cat.type === 'Intangible');
      return {
        category: cat.name,
        totalItems: catAssets.length,
        totalValue: catAssets.reduce((sum, asset) => sum + (asset.RateIncludingTaxes || 0), 0),
        tangibleCount: tangibleAssets.length,
        tangibleValue: tangibleAssets.reduce((sum, asset) => sum + (asset.RateIncludingTaxes || 0), 0),
        intangibleCount: intangibleAssets.length,
        intangibleValue: intangibleAssets.reduce((sum, asset) => sum + (asset.RateIncludingTaxes || 0), 0),
      };
    });
    res.status(200).json({ success: true, data: breakdown });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}; 