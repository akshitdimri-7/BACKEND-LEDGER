const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required to create a user."],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address."],
      unique: [true, "This email already exists."],
    },
    name: {
      type: String,
      required: [true, "Name is required to create an account."],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is a mandatory field."],
      minLength: [6, "Password must be greater than 5 characters."],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;