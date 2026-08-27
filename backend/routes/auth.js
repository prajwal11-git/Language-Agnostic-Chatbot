import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/authController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refreshAccessToken);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticateJWT, getProfile);

export default authRouter;
