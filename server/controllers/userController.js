import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Signup controller
export const signup = async (req, res) => {
  const { fullname, email, password, bio } = req.body;
  console.log(req.body);
  try {
    if (!fullname || !email || !password||!bio) {
      return res.status(400).send({ error: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({ error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      bio,
    });
    const token = generateToken(newUser._id);
    return res
      .status(201)
      .json({
        success: true,
        userData: newUser,
        token,
        message: "User created successfully",
      });
  } catch (err) {
    console.log("Error in signup", err);
    res.status(500).send({ error: "Server error" });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send({ error: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      userData: user,
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.log("Error in login", err);
    res.status(500).send({ error: "Server error" });
  }
};

export const checkAuth = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, bio, pic } = req.body;
    const userId = req.user._id;
    let updatedUser;
    if (!pic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullname, bio },
        { new: true }
      ).select("-password");
    } else {
      const upload = await cloudinary.uploader.upload(pic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullname, bio, pic: upload.secure_url },
        { new: true }
      ).select("-password");
    }
    res.json({
      success: true,
      updatedUser,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.log("Error in update profile", err);
    res.status(500).send({ error: "Server error" });
  }
};
