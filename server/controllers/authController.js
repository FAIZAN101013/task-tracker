import User from "../models/User.js";
import sendTokenCookie, { clearTokenCookie } from "../utils/generateToken.js";

// Shape a user document for the client. Never leaks the password hash.
const toPublicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

// @desc    Register a new account
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are all required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    res.status(400);
    throw new Error("An account with that email already exists");
  }

  const user = await User.create({ name, email, password });

  sendTokenCookie(res, user._id);

  res.status(201).json(toPublicUser(user));
};

// @desc    Log in and receive a session cookie
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // password is select:false on the schema, so ask for it explicitly
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  // Same message either way so we don't reveal which emails are registered
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  sendTokenCookie(res, user._id);

  res.status(200).json(toPublicUser(user));
};

// @desc    Clear the session cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  clearTokenCookie(res);

  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Return the currently logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.status(200).json(toPublicUser(req.user));
};

export { toPublicUser };
