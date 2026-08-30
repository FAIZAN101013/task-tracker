import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Rejects the request unless it carries a valid token cookie.
export const protect = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, please log in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token is invalid or expired" });
  }
};
