// const mongoose = require("mongoose")

// const AssetSchema = new mongoose.Schema(
//   {
//     uniqueId: {
//       type: String,
//       required: [true, "Unique ID is required"],
//       unique: true,
//     },
//     assetName: {
//       type: String,
//       required: [true, "Asset name is required"],
//     },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: [true, "Category is required"],
//     },
//     make: {
//       type: String,
//     },
//     model: {
//       type: String,
//     },
//     serialNumber: {
//       type: String,
//     },
//     purchaseDate: {
//       type: Date,
//     },
//     invoiceNumber: {
//       type: String,
//     },
//     vendorName: {
//       type: String,
//     },
//     quantity: {
//       type: Number,
//       default: 1,
//     },
//     rate: {
//       type: Number,
//     },
//     issuedTo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     status: {
//       type: String,
//       enum: ["available", "issued", "maintenance", "retired"],
//       default: "available",
//     },
//     specifications: {
//       type: Object,
//       default: {},
//     },
//   },
//   {
//     timestamps: true,
//   },
// )

// module.exports = mongoose.model("Asset", AssetSchema)








// const mongoose = require("mongoose");

// const AssetSchema = new mongoose.Schema(
//   {
//     UniqueID: {
//       type: String,
//       // required: [true, "Unique ID is required"],
//       // unique: true,
//     },
//     AssetName: {
//       type: String,
//       // required: [true, "Asset name is required"],
//     },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: [true, "Category is required"],
//     },
//     MakeModel: {
//       type: String,
//     },
//     ProductSerialNumber: {
//       type: String,
//     },
//     PurchaseDate: {
//       type: Date,
//     },
//     InvoiceNumber: {
//       type: String,
//     },
//     VendorName: {
//       type: String,
//     },
//     Quantity: {
//       type: Number,
//       default: 1,
//     },
//     RateIncludingTaxes: {
//       type: Number,
//     },
//     SessionStartDate: {
//       type: Date,
//     },
//     SessionEndDate: {
//       type: Date,
//     },
//     SimilarName: {
//       type: String,
//     },
//     IssuedTo: {
//       type: String, // if you're not referencing User ID, keep as string
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Asset", AssetSchema);






const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  AssetName: {
    type: String,
    required: true,
  },
  SimilarName: String,
  InvoiceNumber: String,
  IssuedTo: String,
  Make: String,
  Model: String,
  ProductSerialNumber: String,
  PurchaseDate: Date,
  Quantity: Number,
  RateIncludingTaxes: Number,
  SessionStartDate: Date,
  SessionEndDate: Date,
  VendorName: String,
  UniID: {
    type: String,
    required: true,
    unique: true,
  },
  Category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  CreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  UpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  AssignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  Status: {
    type: String,
    enum: ['available', 'assigned'],
    default: 'available',
  },
  LastUpdated: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
