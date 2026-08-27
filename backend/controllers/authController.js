import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const ROLES = ["student", "faculty", "admin"];
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

const getAccessTokenSecret = () => {
  return process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
};

const getRefreshTokenSecret = () => {
  return process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
};

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const ensureSecrets = () => {
  if (!getAccessTokenSecret()) {
    throw new Error("ACCESS_TOKEN_SECRET or JWT_SECRET environment variable is not set");
  }

  if (!getRefreshTokenSecret()) {
    throw new Error("REFRESH_TOKEN_SECRET or JWT_SECRET environment variable is not set");
  }
};

const createAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
      type: "access",
    },
    getAccessTokenSecret(),
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      type: "refresh",
    },
    getRefreshTokenSecret(),
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

const buildUserPayload = (user) => ({
  id: user._id,
  email: user.email,
  role: user.role,
});

const saveRefreshTokenAndSetCookie = async (res, user) => {
  const refreshToken = createRefreshToken(user);
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  user.refreshTokenHash = refreshTokenHash;
  await user.save();

  res.cookie("refreshToken", refreshToken, getCookieOptions());
};

export const register = async (req, res) => {
  try {
    ensureSecrets();

    const { email, password, role = "student" } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    await saveRefreshTokenAndSetCookie(res, user);
    const accessToken = createAccessToken(user);

    return res.status(201).json({
      accessToken,
      user: buildUserPayload(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    ensureSecrets();

    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (role && role !== user.role) {
      return res.status(403).json({ message: "Selected role does not match account role" });
    }

    await saveRefreshTokenAndSetCookie(res, user);
    const accessToken = createAccessToken(user);

    return res.status(200).json({
      accessToken,
      user: buildUserPayload(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    ensureSecrets();

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const payload = jwt.verify(refreshToken, getRefreshTokenSecret());
    if (payload.type !== "refresh") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(payload.sub);
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    await saveRefreshTokenAndSetCookie(res, user);
    const accessToken = createAccessToken(user);

    return res.status(200).json({
      accessToken,
      user: buildUserPayload(user),
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const payload = jwt.verify(refreshToken, getRefreshTokenSecret());
        const user = await User.findById(payload.sub);
        if (user) {
          user.refreshTokenHash = null;
          await user.save();
        }
      } catch {
        // Ignore invalid token, but still clear cookie
      }
    }

    res.clearCookie("refreshToken", getCookieOptions());
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
