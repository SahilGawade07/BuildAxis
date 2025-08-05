import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

export const isPromoter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user = (req as any).dbUser;
  
  if (!user) {
    user = await User.findById((req as any).user.id);
  }
  

  if (user.role !== "promoter") {
    return res.status(403).json({
      success: false,
      message: "Only promoters can perform this action",
    });
  }

  next();
};
