const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const AuthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    department:String,
        // required: [true, "Department is required"],
        position:String,  
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Encrypt password using bcrypt
// AuthSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next()
//   }

//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
// })

// Match user entered password to hashed password in database
// AuthSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password)
// }
// AuthSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

AuthSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
module.exports = mongoose.model("auth", AuthSchema)

