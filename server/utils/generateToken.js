import jwt from "jsonwebtoken";

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

// Signs a JWT for the user and sends it back as an httpOnly cookie.
const sendTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    // Cross-site cookies (Vercel client -> Render API) require SameSite=None
    sameSite: isProduction ? "none" : "lax",
    maxAge: SEVEN_DAYS_IN_MS,
  });

  return token;
};

export const clearTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
};

export default sendTokenCookie;
