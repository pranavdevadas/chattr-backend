import mongoose from "mongoose";
import { IMessage, IChat } from "../../types/message.types";

export interface IMessageRepository {
  createMessage(
    chatId: string,
    senderId: string,
    content: string,
    type: "text" | "image" | "video"
  ): Promise<IMessage>;
  updateLatestMessage(chatId: string, messageId: string): Promise<void>;
  getMessagesByChat(chatId: string): Promise<IMessage[]>;
  getChatsByUser(userId: string): Promise<IChat[]>;
  findChatBetweenUsers(user1: string, user2: string): Promise<IChat | null>;
  createChat(chatData: Partial<IChat>): Promise<IChat>;
  getLastMessage(chatId: string): Promise<IMessage | null>;
  markMessagesAsRead(chatId: string, userId: string): Promise<void>;
  createMessage(chatId: string,senderId: string,content: string, type?: "text" | "image" | "video"): Promise<IMessage>;
}
