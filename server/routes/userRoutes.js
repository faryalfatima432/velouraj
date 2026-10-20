import express from "express";

import {
	getProfile,
	updateProfile,
	getUsers,
	updateUser,
	deleteUser,
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();


// Protected profile route
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/admin", protect, adminOnly, getUsers);
router.put("/admin/:id", protect, adminOnly, updateUser);
router.delete("/admin/:id", protect, adminOnly, deleteUser);


export default router;