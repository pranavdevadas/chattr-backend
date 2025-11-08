import { Server, Socket } from "socket.io";
import { container } from "../config/container";
import { IMessageService } from "../interface/message/IMessageService";
import { sendPushNotification } from "../config/firebaseAdmin";

export let io: Server;

const onlineUsers: Map<string, Set<string>> = new Map();

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  const messageService = container.get<IMessageService>("IMessageService");

  // Connection handling
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // User online status
    socket.on("user_online", (userId: string) => {
      if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
      onlineUsers.get(userId)!.add(socket.id);

      console.log(`User ${userId} is online`);

      io.emit("user_status_update", { userId, status: "online" });
    });

    //Join chat room
    socket.on("join_chat", (chatId: string) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    // Handle sending messages
    socket.on(
      "send_message",
      async (data: { chatId: string; senderId: string; content: string }) => {
        try {
          const message = await messageService.sendMessage(
            data.chatId,
            data.senderId,
            data.content
          );

          io.to(data.chatId).emit("receive_message", message);

          io.to(data.chatId).emit("chat_updated", {
            chatId: data.chatId,
            latestMessage: message,
          });

          io.emit("chat_updated_global", {
            chatId: data.chatId,
            latestMessage: message,
          });

          const chat = await messageService.getChatById(data.chatId);
          if (!chat) {
            console.error("Chat not found for ID:", data.chatId);
            return;
          }
          const receiver = chat.participants.find(
            (p: any) => p._id.toString() !== data.senderId
          );
          const sender = chat.participants.find(
            (p: any) => p._id.toString() === data.senderId
          );
          if (!receiver) {
            console.error("Receiver not found in chat participants");
            return;
          }

        } catch (err) {
          console.error("Error sending message:", err);
        }
      }
    );

    // Mark messages as read
    socket.on(
      "mark_as_read",
      async (data: { chatId: string; userId: string }) => {
        try {
          await messageService.markMessagesAsRead(data.chatId, data.userId);

          io.to(data.chatId).emit("messages_read", {
            chatId: data.chatId,
            readerId: data.userId,
          });
        } catch (err) {
          console.error("Error marking messages as read:", err);
        }
      }
    );

    // Typing indicator
    socket.on("typing", (data: { chatId: string; userId: string }) => {
      socket.to(data.chatId).emit("user_typing", {
        chatId: data.chatId,
        userId: data.userId,
      });
    });
    socket.on("stop_typing", (data: { chatId: string; userId: string }) => {
      socket.to(data.chatId).emit("user_stop_typing", {
        chatId: data.chatId,
        userId: data.userId,
      });
    });

    //Disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      //  Remove socket from onlineUsers
      onlineUsers.forEach((sockets, userId) => {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          // Broadcast offline status
          io.emit("user_status_update", { userId, status: "offline" });
        }
      });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
