import { IMessage, IChat } from "../../types/message.types";

export interface IMessageService {
  sendMessage(chatId: string, senderId: string, content: string): Promise<IMessage>;
  getMessagesByChat(chatId: string): Promise<IMessage[]>;
  getChatsByUser(userId: string): Promise<IChat[]>;
  createOrGetChat(senderId: string, receiverId: string): Promise<IChat>
  getLastMessage(chatId: string): Promise<IMessage | null>
  markMessagesAsRead(chatId: string, userId: string): Promise<void>
  sendMediaMessage(chatId: string, senderId: string, mediaUrl: string, mediaType: "image" | "video"): Promise<IMessage>
}
