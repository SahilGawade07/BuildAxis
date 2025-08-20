import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

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
      async (err: jwt.VerifyErrors | null, user: any) => {
        if (err) {
          // Token expired or invalid, try to refresh
          if (err.name === 'TokenExpiredError') {
            try {
              const refreshToken = req.cookies.refreshToken || req.headers['x-refresh-token'];
              if (refreshToken) {
                const newToken = await attemptTokenRefresh(refreshToken);
                if (newToken) {
                  // Set new token in response headers
                  res.setHeader('X-New-Access-Token', newToken);
                  
                  // Verify the new token
                  const decoded = jwt.verify(newToken, process.env.JWT_SECRET as string) as any;
                  (req as any).user = decoded;
                  (req as any).dbUser = await User.findById(decoded.id);
                  return next();
                }
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
            }
          }
          
          return res.status(403).json({
            success: false,
            message: "Invalid or expired access token",
            error: "TOKEN_EXPIRED",
          });
        }

        // Token is valid, get user data from database
        try {
          const dbUser = await User.findById(user.id);
          if (!dbUser) {
            return res.status(401).json({
              success: false,
              message: "User not found",
            });
          }
          
          (req as any).user = user;
          (req as any).dbUser = dbUser;
          next();
        } catch (dbError) {
          console.error('Database error:', dbError);
          return res.status(500).json({
            success: false,
            message: "Database error",
          });
        }
      }
    );
  } else {
    res.status(401).json({
      success: false,
      message: "Access token missing",
    });
  }
};

// Helper function to attempt token refresh
async function attemptTokenRefresh(refreshToken: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;

    if (!decoded || !decoded.id) {
      return null;
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return null;
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    return newAccessToken;
  } catch (error) {
    return null;
  }
}
