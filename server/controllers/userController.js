import bcrypt from "bcryptjs";
import User from "../models/User.js";

const publicUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  profileImage: user.profileImage,
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
});

export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: publicUser(req.user),
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (!name?.trim() || !email?.trim()) return res.status(400).json({ success: false, message: "Name and email are required." });

    const normalizedEmail = email.toLowerCase().trim();
    const duplicate = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
    if (duplicate) return res.status(400).json({ success: false, message: "Email is already in use." });

    user.name = name.trim();
    user.email = normalizedEmail;
    user.phone = phone?.trim() || "";
    if (password?.trim()) user.password = await bcrypt.hash(password.trim(), 10);
    await user.save();

    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to update profile." });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -googleId -facebookId").sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to load users." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, isActive, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (user._id.equals(req.user._id) && role === "customer") return res.status(400).json({ success: false, message: "You cannot remove your own admin access." });
    if (email) user.email = email.toLowerCase().trim();
    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (role && ["customer", "admin"].includes(role)) user.role = role;
    if (isActive !== undefined) user.isActive = Boolean(isActive);
    if (password?.trim()) user.password = await bcrypt.hash(password.trim(), 10);
    await user.save();
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    return res.status(400).json({ success: false, message: error.message || "Unable to update user." });
  }
};

export const deleteUser = async (req, res) => {
  if (req.params.id === req.user._id.toString()) return res.status(400).json({ success: false, message: "You cannot delete your own admin account." });
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  return res.json({ success: true, message: "User deleted successfully." });
};