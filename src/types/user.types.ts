import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  userName: string;
  email: string;
  otp?: number;
  profileImage: string;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OtpVerificationResult {
  message: string;
  user: {
    _id: mongoose.Types.ObjectId;
    name: string;
    userName: string;
    email: string;
    profileImage: string;
  };
  accessToken: string;
  refreshToken: string;
}
