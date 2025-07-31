import { Request, Response, NextFunction } from "express";
import { User } from "../../models/User";
import { Organisation } from "../../models/Organisation";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const generateAccessToken = (userId: string, email: string, role: string) => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" } 
  );
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" } 
  );
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, fName, lName, phone, role, password, profilePic } = req.body;

    if (!email || !fName || !lName || !phone || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields including password are required",
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }

    const newUser = await User.create({
      email,
      fName,
      lName,
      phone,
      password,
      role,
      profilePic,
    });

    const userResponse = {
      id: newUser._id,
      email: newUser.email,
      fName: newUser.fName,
      lName: newUser.lName,
      phone: newUser.phone,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    const accessToken = generateAccessToken(
      (newUser._id as Types.ObjectId).toString(),
      newUser.email,
      newUser.role
    );
    const refreshToken = generateRefreshToken(
      (newUser._id as Types.ObjectId).toString()
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const userResponse = {
      id: user._id,
      email: user.email,
      fName: user.fName,
      lName: user.lName,
      phone: user.phone,
      role: user.role,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
    };

    const accessToken = generateAccessToken(
      (user._id as Types.ObjectId).toString(),
      user.email,
      user.role
    );
    const refreshToken = generateRefreshToken(
      (user._id as Types.ObjectId).toString()
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(
      (user._id as Types.ObjectId).toString(),
      user.email,
      user.role
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string
      ) as any;
      if (decoded && decoded.id) {
        await User.findByIdAndUpdate(decoded.id, { refreshToken: "" });
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
