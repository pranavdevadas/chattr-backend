import { Request, Response, NextFunction } from "express";
import TokenService from "../util/generateToken";

interface AuthRequest extends Request {
  userId?: string; // your custom property
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken || (req.headers.authorization?.split(" ")[1] ?? null);
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  const payload = TokenService.verifyAccessToken(token);
  if (!payload) return res.status(401).json({ message: "Invalid or expired access token" });
  (req as any).userId = payload?.userId;
  next();
};