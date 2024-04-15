import express from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { Auth } from "../controllers/auth.controller.js";
const authController = new Auth();
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authenticate, authController.logout);
router.get("/forgot-password", authenticate, authController.forgotPassword);

export default router;
