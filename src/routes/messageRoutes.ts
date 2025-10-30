import express from "express";
import { container } from "../config/container";
import { protect } from "../middleware/authMiddleware";
import { MessageController } from "../controller/messageController";
import { uploadMessageMedia } from "../config/multer";

const router = express.Router();
const messageController = container.get<MessageController>("MessageController");

router.post("/message", protect, messageController.sendMessage);
router.get("/message/:chatId", protect, messageController.getMessages);
router.get("/all-chat", protect, messageController.getUserChats);
router.post("/create-chat", protect, messageController.createChat);

router.post("/media-message", protect, uploadMessageMedia.single("file"), messageController.sendMediaMessage);

export default router;
