import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: jwt.VerifyErrors | null, user: any) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: "Invalid or expired access token",
            error: "TOKEN_EXPIRED",
          });
        }

        (req as any).user = user;      

        next();
      }
    );
  } else {
    res.status(401).json({
      success: false,
      message: "Access token missing",
    });
  }
};
