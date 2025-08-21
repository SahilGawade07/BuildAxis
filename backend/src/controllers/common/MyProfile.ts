import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../models/User";

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).dbUser;

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        id: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).dbUser;
    const { fName, lName, email, profilePic, phone, password } = req.body;

    if (fName) user.fName = fName;
    if (lName) user.lName = lName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (profilePic) user.profilePic = profilePic;
    if (password) {
      // Let mongoose pre-save hook hash the password
      user.password = password;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const user = (req as any).dbUser;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Always fetch fresh user data with password field to ensure we have the most current data
    const userWithPassword = await User.findById(user._id).select("+password");

    if (!userWithPassword) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await userWithPassword.isPasswordCorrect(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Assign plain new password; pre-save hook will hash it
    userWithPassword.password = newPassword;

    await userWithPassword.save();

    // Update the req.dbUser object to reflect the changes
    (req as any).dbUser = userWithPassword;

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
