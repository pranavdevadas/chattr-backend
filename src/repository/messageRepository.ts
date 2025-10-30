import { injectable } from "inversify";
import User from "../model/userModel";
import Chat from "../model/chatModel";
import Message from "../model/messageModel";
import { IChat, IMessage } from "../types/message.types";
import { BaseRepository } from "./base/baseRepository";
import { IMessageRepository } from "../interface/message/IMessageRepository";

@injectable()
export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  private readonly MessageModel = Message;
  private readonly ChatModel = Chat;

  constructor() {
    super(Message);
  }

  async createMessage(
    chatId: string,
    senderId: string,
    content: string,
    type: "text" | "image" | "video" = "text"
  ): Promise<IMessage> {
    const message = await this.MessageModel.create({
      chat: chatId,
      sender: senderId,
      content,
      type
    });
    return message;
  }

  async updateLatestMessage(chatId: string, messageId: string): Promise<void> {
    await this.ChatModel.findByIdAndUpdate(chatId, {
      latestMessage: messageId,
    });
  }

  async getMessagesByChat(chatId: string): Promise<IMessage[]> {
    return this.MessageModel.find({ chat: chatId })
      .populate("sender", "userName profileImage")
      .sort({ createdAt: 1 });
  }

  async getChatsByUser(userId: string): Promise<IChat[]> {
    return this.ChatModel.find({ participants: userId })
      .populate("participants", "name userName profileImage email")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
  }

  async findChatBetweenUsers(
    user1: string,
    user2: string
  ): Promise<IChat | null> {
    return await this.ChatModel.findOne({
      participants: { $all: [user1, user2] },
    })
      .populate("participants", "name userName email profileImage")
      .populate("latestMessage");
  }

  async createChat(chatData: Partial<IChat>): Promise<IChat> {
    const newChat = await this.ChatModel.create(chatData);
    return await newChat.populate(
      "participants",
      "name userName email profileImage"
    );
  }

  async getLastMessage(chatId: string): Promise<IMessage | null> {
    return await this.MessageModel.findOne({ chat: chatId })
      .sort({ createdAt: -1 })
      .populate("sender", "name userName profileImage");
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    await this.MessageModel.updateMany(
      { chat: chatId, readBy: { $ne: userId } },
      { $push: { readBy: userId } }
    );
  }


}
