import multer from "multer";
import path from "path";
import fs from "fs";

const PROFILE_PIC_DIR = path.join(__dirname, "../public/profilePic");
const MESSAGE_MEDIA_DIR = path.join(__dirname, "../public/messageMedia");

if (!fs.existsSync(PROFILE_PIC_DIR)) {
  fs.mkdirSync(PROFILE_PIC_DIR, { recursive: true });
}
if (!fs.existsSync(MESSAGE_MEDIA_DIR)) {
  fs.mkdirSync(MESSAGE_MEDIA_DIR, { recursive: true });
}


// Upload Profile Images
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PROFILE_PIC_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};


// Upload Message Media
const messageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, MESSAGE_MEDIA_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const messageFileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const isImage = file.mimetype.startsWith("image/");
  const isVideo = file.mimetype.startsWith("video/");

  if (!isImage && !isVideo) {
    return cb(new Error("Only image and video files are allowed!"));
  }

  cb(null, true);
};

export const uploadProfileImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadMessageMedia = multer({
  storage: messageStorage,
  fileFilter: messageFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});
