import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectToDatabase from "./database/mongodb.js";
import authRouter from "./routes/auth.js";
import protectedRouter from "./routes/protected.js";
import { authenticateJWT, authorizeRoles } from "./middleware/authMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || 5500;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.use("/api/student", authenticateJWT, authorizeRoles("student"), protectedRouter);
app.use("/api/faculty", authenticateJWT, authorizeRoles("faculty"), protectedRouter);
app.use("/api/admin", authenticateJWT, authorizeRoles("admin"), protectedRouter);

app.listen(PORT, async () => {
  console.log(`Chat API running on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
