const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    type: {
      type: String,
      enum: ["Tangible", "Intangible"],
      required: [true, "Category type is required"],
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Category", CategorySchema)

