import { inject, injectable } from "inversify";
import { IUserService } from "../interface/user/IUserService";
import { IUser, OtpVerificationResult } from "../types/user.types";
import { IUserRepository } from "../interface/user/IUserRepository";
import { sendMail } from "../config/mail";
import TokenService from "../util/generateToken";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async register(name: string, email: string, res: any): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(email);
    const otp = Math.floor(100000 + Math.random() * 900000);

    if (existingUser) {
      throw new Error("User already exist. Please Login");
    }

    const userName =
      name.toLowerCase().replace(/\s+/g, "") + Date.now().toString().slice(-4);

    await sendMail(email, "Your OTP", `Your Chattr OTP is ${otp}`);

    const user = await this.userRepository.create({
      name,
      email,
      userName,
      otp,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Partial<IUser>);

    return user;
  }

  async login(email: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    const otp = Math.floor(100000 + Math.random() * 900000);

    if (user) {
      await this.userRepository.saveOtp(email, otp);
      await sendMail(email, "Login OTP", `Your OTP is ${otp}`);
      return {
        ...user,
        otp,
        message: "Please Enter Your OTP. Sended to Your Email",
      } as unknown as IUser;
    } else {
      throw new Error("User not found");
    }
  }

  async verifyOtp(
    email: string,
    otp: number,
    res: any
  ): Promise<OtpVerificationResult> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.otp !== otp) throw new Error("Invalid OTP");

    const verifiedUser = await this.userRepository.markVerified(email);
    if (!verifiedUser) throw new Error("Failed to verify user");

    const { accessToken, refreshToken } = TokenService.generateAuthTokens(
      verifiedUser._id.toString()
    );

    TokenService.setTokenCookie(res, accessToken, refreshToken);

    return {
      message: "OTP verified, login successful",
      user: {
        _id: verifiedUser._id,
        name: verifiedUser.name,
        userName: verifiedUser.userName,
        email: verifiedUser.email,
        profileImage: verifiedUser.profileImage,
      },
      accessToken,
      refreshToken,
    };
  }

  async resendOtp(email: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    const otp = Math.floor(100000 + Math.random() * 900000);

    if (user) {
      await this.userRepository.saveOtp(email, otp);
      await sendMail(email, "Login OTP", `Your OTP is ${otp}`);
      return {
        ...user,
        otp,
        message: "Please Enter Your OTP. Sended to Your Email",
      } as unknown as IUser;
    } else {
      throw new Error("User not found");
    }
  }

  async logout(email: string): Promise<void> {
    await this.userRepository.markUnverified(email);
  }

  async updateUser(
    email: string,
    name?: string,
    userName?: string,
    profileImage?: string
  ): Promise<IUser> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const updateData: Partial<IUser> = {};
    if (name) updateData.name = name;
    if (userName) updateData.userName = userName;
    if (profileImage) updateData.profileImage = profileImage;

    const updatedUser = await this.userRepository.updateUser(email, updateData);
    if (!updatedUser) throw new Error("Failed to update user");

    return updatedUser;
  }

  async searchUsers(query: string): Promise<any[]> {
    return await this.userRepository.searchUsers(query);
  }
}
