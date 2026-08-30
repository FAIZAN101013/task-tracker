import User from "../models/User.js";
import Task from "../models/Task.js";
import { toPublicUser } from "./authController.js";
import { clearTokenCookie } from "../utils/generateToken.js";

// @desc    Update the logged in user's name and email
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user._id);

  if (email && email.toLowerCase() !== user.email) {
    const emailTaken = await User.findOne({ email: email.toLowerCase() });

    if (emailTaken) {
      res.status(400);
      throw new Error("An account with that email already exists");
    }

    user.email = email;
  }

  if (name) {
    user.name = name;
  }

  const updatedUser = await user.save();

  res.status(200).json(toPublicUser(updatedUser));
};

// @desc    Change the logged in user's password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current and new password are both required");
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Your current password is incorrect");
  }

  // The pre-save hook hashes this before it reaches the database
  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
};

// @desc    Delete the logged in user along with all of their tasks
// @route   DELETE /api/users/profile
// @access  Private
export const deleteAccount = async (req, res) => {
  await Task.deleteMany({ user: req.user._id });
  await User.findByIdAndDelete(req.user._id);

  clearTokenCookie(res);

  res.status(200).json({ message: "Account deleted successfully" });
};

// @desc    Task counts for the logged in user, grouped by status
// @route   GET /api/users/stats
// @access  Private
export const getStats = async (req, res) => {
  const [total, pending, inProgress, completed] = await Promise.all([
    Task.countDocuments({ user: req.user._id }),
    Task.countDocuments({ user: req.user._id, status: "Pending" }),
    Task.countDocuments({ user: req.user._id, status: "In Progress" }),
    Task.countDocuments({ user: req.user._id, status: "Completed" }),
  ]);

  res.status(200).json({ total, pending, inProgress, completed });
};
