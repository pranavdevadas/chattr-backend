import { inject, injectable } from "inversify";
import { IMessageService } from "../interface/message/IMessageService";
import { IMessageRepository } from "../interface/message/IMessageRepository";
import { IMessage, IChat } from "../types/message.types";

@injectable()
export class messageService implements IMessageService {
  constructor(
    @inject("IMessageRepository") private messageRepository: IMessageRepository
  ) {}

  async sendMessage(
    chatId: string,
    senderId: string,
    content: string,
  ): Promise<IMessage> {
    const message = await this.messageRepository.createMessage(
      chatId,
      senderId,
      content,
    );

    await this.messageRepository.updateLatestMessage(
      chatId,
      message._id.toString()
    );

    return message;
  }

  async getMessagesByChat(chatId: string): Promise<IMessage[]> {
    const messages = await this.messageRepository.getMessagesByChat(chatId);
    return messages;
  }

  async getChatsByUser(userId: string): Promise<IChat[]> {
    const chats = await this.messageRepository.getChatsByUser(userId);
    return chats;
  }

  async createOrGetChat(senderId: string, receiverId: string): Promise<IChat> {
    const existingChat = await this.messageRepository.findChatBetweenUsers(
      senderId,
      receiverId
    );

    if (existingChat) {
      return existingChat;
    }

    const newChat = await this.messageRepository.createChat({
      participants: [senderId, receiverId],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Partial<IChat>);

    return newChat;
  }

  async getLastMessage(chatId: string): Promise<IMessage | null> {
    const lastMessage = await this.messageRepository.getLastMessage(chatId);
    return lastMessage;
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    await this.messageRepository.markMessagesAsRead(chatId, userId);
  }

  async sendMediaMessage(
    chatId: string,
    senderId: string,
    mediaUrl: string,
    mediaType: "image" | "video"
  ): Promise<IMessage> {
    const message = await this.messageRepository.createMessage(
      chatId,
      senderId,
      mediaUrl,
      mediaType
    );

    await this.messageRepository.updateLatestMessage(
      chatId,
      message._id.toString()
    );
    return message;
  }


}
