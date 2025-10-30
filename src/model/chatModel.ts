import mongoose, { Model } from "mongoose";
import { IChat } from "../types/message.types";

const chatSchema = new mongoose.Schema<IChat>(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

const Chat: Model<IChat> = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
