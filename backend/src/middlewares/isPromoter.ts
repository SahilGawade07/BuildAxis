import { Request, Response, NextFunction } from "express";

export const isPromoter = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).dbUser;

  if (user.role !== "promoter") {
    return res.status(403).json({
      success: false,
      message: "Only promoters can perform this action",
    });
  }

  next();
};
