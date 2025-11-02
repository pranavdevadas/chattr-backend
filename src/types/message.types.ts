import mongoose, { Document } from "mongoose";
import { IUser } from "./user.types";

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  chat: mongoose.Types.ObjectId;
  readBy: mongoose.Types.ObjectId;
  type: "text" | "image" | "video";
  status?: "sending" | "sent" | "delivered";
  createdAt: Date;
  updatedAt: Date;
}

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  participants: IUser[];
  latestMessage?: mongoose.Types.ObjectId;
  type: "text" | "image" | "video";
  createdAt: Date;
  updatedAt: Date;
}
