import express from "express";
import {
  updateProfile,
  changePassword,
  deleteAccount,
  getStats,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Everything below belongs to the logged in user
router.use(protect);

router.put("/profile", updateProfile);
router.delete("/profile", deleteAccount);
router.put("/password", changePassword);
router.get("/stats", getStats);

export default router;
