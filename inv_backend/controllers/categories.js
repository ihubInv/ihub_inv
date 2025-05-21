// const Category = require("../models/Category")
// const Asset = require("../models/Asset")

// // @desc    Create new category
// // @route   POST /api/categories
// // @access  Private/Admin
// exports.createCategory = async (req, res) => {
//   try {
//     const category = await Category.create(req.body)

//     res.status(201).json({
//       success: true,
//       data: category,
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     })
//   }
// }

// // @desc    Get all categories
// // @route   GET /api/categories
// // @access  Private
// exports.getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find().sort("name")

//     // Get asset count for each category
//     const categoriesWithCount = await Promise.all(
//       categories.map(async (category) => {
//         const count = await Asset.countDocuments({ category: category._id })
//         return {
//           ...category.toObject(),
//           assetCount: count,
//         }
//       }),
//     )

//     res.status(200).json({
//       success: true,
//       count: categories.length,
//       data: categoriesWithCount,
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     })
//   }
// }

// // @desc    Get single category
// // @route   GET /api/categories/:id
// // @access  Private
// exports.getCategory = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id)

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       })
//     }

//     // Get asset count for the category
//     const assetCount = await Asset.countDocuments({ category: category._id })

//     res.status(200).json({
//       success: true,
//       data: {
//         ...category.toObject(),
//         assetCount,
//       },
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     })
//   }
// }

// // @desc    Update category
// // @route   PUT /api/categories/:id
// // @access  Private/Admin
// exports.updateCategory = async (req, res) => {
//   try {
//     let category = await Category.findById(req.params.id)

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       })
//     }

//     category = await Category.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     })

//     // Get asset count for the category
//     const assetCount = await Asset.countDocuments({ category: category._id })

//     res.status(200).json({
//       success: true,
//       data: {
//         ...category.toObject(),
//         assetCount,
//       },
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     })
//   }
// }

// // @desc    Delete category
// // @route   DELETE /api/categories/:id
// // @access  Private/Admin
// exports.deleteCategory = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id)

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       })
//     }

//     // Check if category is being used by any assets
//     const assetCount = await Asset.countDocuments({ category: category._id })

//     if (assetCount > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot delete category. It is associated with ${assetCount} assets.`,
//       })
//     }

//     await category.deleteOne()

//     res.status(200).json({
//       success: true,
//       data: {},
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     })
//   }
// }







const mongoose = require("mongoose");
const Category = require("../models/Category");
const Asset = require("../models/Asset");

// Helper to validate Mongo ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort("name");

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Asset.countDocuments({ category: category._id });
        return {
          ...category.toObject(),
          assetCount: count,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categoriesWithCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
exports.getCategory = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const assetCount = await Asset.countDocuments({ category: category._id });

    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        assetCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  try {
    let category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    const assetCount = await Asset.countDocuments({ category: category._id });

    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        assetCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const assetCount = await Asset.countDocuments({ category: category._id });

    if (assetCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is associated with ${assetCount} assets.`,
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

