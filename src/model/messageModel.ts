import mongoose, { Model } from "mongoose";
import { IMessage } from "../types/message.types";

const messageSchema = new mongoose.Schema<IMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, trim: true, required: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    type: {
      type: String,
      enum: ["text", "image", "video"],
      default: "text",
    },
    status: {
      type: String,
      enum: ["sending", "sent", "delivered"],
      default: "sent",
    },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  messageSchema
);

export default Message;
