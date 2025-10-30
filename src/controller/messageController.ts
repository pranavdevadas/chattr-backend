import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { IMessageService } from "../interface/message/IMessageService";
import { io } from "../util/socket";

@injectable()
export class MessageController {
  constructor(
    @inject("IMessageService") private messageService: IMessageService
  ) {}

  sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { chatId, content } = req.body;
    const senderId = (req as any).userId;

    if (!senderId) {
      res.status(400).json({ message: "sender Id not found" });
      return;
    }

    if (!chatId || !content) {
      res.status(400).json({ message: "chatId, and content are required" });
      return;
    }

    const message = await this.messageService.sendMessage(
      chatId,
      senderId,
      content
    );
    res.status(201).json(message);
  });

  getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }
    const messages = await this.messageService.getMessagesByChat(chatId);
    res.status(200).json(messages);
  });

  getUserChats = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    const chats = await this.messageService.getChatsByUser(userId);
    res.status(200).json(chats);
  });

  createChat = asyncHandler(async (req: Request, res: Response) => {
    const { receiverId } = req.body;
    const senderId = (req as any).userId;

    if (!senderId) {
      res.status(400).json({ message: "sender Id not found" });
      return;
    }

    if (!receiverId) {
      res.status(400).json({ message: "Reciever's Id required" });
      return;
    }
    const chat = await this.messageService.createOrGetChat(
      senderId,
      receiverId
    );

    res.status(200).json(chat);
  });

  sendMediaMessage = asyncHandler(async (req: Request, res: Response) => {
    const { chatId } = req.body;
    const senderId = (req as any).userId;
    const file = req.file;

    if (!senderId) {
      res.status(400).json({ message: "sender Id not found" });
      return;
    }

    if (!chatId || !file) {
      res.status(400).json({ message: "chatId and media file are required" });
      return;
    }

    const filePath = `public/messageMedia/${file.filename}`;
    const fileType = file.mimetype.startsWith("video/") ? "video" : "image";
    const message = await this.messageService.sendMediaMessage(
      chatId,
      senderId,
      filePath,
      fileType
    );
    io.to(chatId).emit("receive_message", message);
    let latestMessageForList = { ...message };

    if (message.type === "image") {
      latestMessageForList = { ...message, content: "Photo" };
    } else if (message.type === "video") {
      latestMessageForList = { ...message, content: "Video" };
    }

    io.to(message.chat.toString()).emit("chat_updated", {
      chatId: message.chat.toString(),
      latestMessage: latestMessageForList,
    });

    io.emit("chat_updated_global", {
      chatId: message.chat.toString(),
      latestMessage: latestMessageForList,
    });
    res.status(201).json(message);
  });
}
