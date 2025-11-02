import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { IUserService } from "../interface/user/IUserService";
import TokenService from "../util/generateToken";

@injectable()
export class UserController {
  constructor(@inject("IUserService") private userService: IUserService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: "Name and email are required" });
      return;
    }

    const user = await this.userService.register(name, email, res);
    res.cookie("userEmail", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(201).json({
      message: "User registered. OTP sent to email",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        otp: user.otp,
        userName: user.userName,
      },
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email required" });
      return;
    }
    const result = await this.userService.login(email);
    res.status(200).json(result);
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: "Email and OTP required" });
      return;
    }
    res.cookie("userEmail", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
    const result = await this.userService.verifyOtp(email, Number(otp), res);
    res.status(200).json(result);
  });

  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email required" });
      return;
    }
    const result = await this.userService.resendOtp(email);
    res.status(200).json(result);
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token" });
      return;
    }

    const payload = TokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const accessToken = TokenService.generateToken(payload.userId);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const email = req.cookies?.userEmail;
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    await this.userService.logout(email);
    res.status(200).json({ message: "Logged out" });
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const email = req.cookies?.userEmail;
    const { name, userName } = req.body;

    if (!email) {
      res
        .status(400)
        .json({ success: false, message: "User email not found in cookies" });
      return;
    }

    const profileImage = req.file
      ? `profilePic/${req.file.filename}`
      : undefined;
    const updatedUser = await this.userService.updateUser(
      email,
      name,
      userName,
      profileImage
    );

    res.status(200).json({ success: true, user: updatedUser });
  });

  searchUsers = asyncHandler(async (req: Request, res: Response) => {
    let { query } = req.body;
    if (!query) {
      res.status(400).json({ message: "Query is required" });
      return;
    }
    const users = await this.userService.searchUsers(query);
    res.status(200).json(users);
  });

  saveFcmToken = asyncHandler(async (req: Request, res: Response) => {
    const email = req.cookies?.userEmail;
    const { fcmToken } = req.body;
    console.log(fcmToken);
    if (!email) {
      res.status(400).json({ message: "User email not found in cookies" });
      return;
    }
    if (!fcmToken) {
      res.status(400).json({ message: "FCM token is required" });
      return;
    }
    await this.userService.saveFcmToken(email, fcmToken);
    res.status(200).json({ message: "FCM token saved successfully" });
  });

  sendNotification = asyncHandler(async (req: Request, res: Response) => {
    const { receiverId, title, body } = req.body;
    if (!receiverId || !title || !body) {
      res.status(400).json({ message: "userId, title and body are required" });
      return;
    }
    await this.userService.sendNotification(receiverId, title, body);
    res.status(200).json({ message: "Notification sent successfully" });
  });
}
