const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service.js");

// register
const userRegisterController = async (req, res) => {
  const { email, name, password } = req.body;

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return res.status(422).json({
      message: "User already exists with this email.",
      status: "failed",
    });
  }

  const newUser = await userModel.create({
    email,
    name,
    password,
  });

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);
  res.status(201).json({
    user: {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    },
    token,
  });

  await emailService.sendRegistrationEmail(newUser.email, newUser.name);
};

// login
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email }).select("+password");

    if (!existingUser) {
      return res.status(401).json({
        message: "No user exists with this email.",
        status: "failed",
      });
    }

    const isMatch = await existingUser.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials.",
        status: "failed",
      });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
    );

    res.cookie("token", token);

    return res.status(200).json({
      user: {
        _id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
      },
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
      status: "failed",
    });
  }
};

module.exports = { userRegisterController, userLoginController };
