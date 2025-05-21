const mongoose = require("mongoose")

const RequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      required: [true, "User ID is required"],
    },
    itemType: {
      type: String,
      required: [true, "Item type is required"],
    },
    itemName: {
      type: String,
      required: [true, "Item name is required"],
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    additionalInfo: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    responseDate: {
      type: Date,
    },
    responseBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
    },
    responseNote: {
      type: String,
    },
    specifications: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Request", RequestSchema)

