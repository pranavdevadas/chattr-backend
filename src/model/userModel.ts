import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "../types/user.types";

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    profileImage: { type: String },
    otp: { type: Number, required: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
