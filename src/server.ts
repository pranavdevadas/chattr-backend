import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import path from "path";
import { initSocket } from "./util/socket";
import http from "http";

//Dotenv config
dotenv.config();

//Database connection
connectDB();

const app = express();
const PORT = Number(process.env.PORT) || 6000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

//Static
app.use("/public", express.static(path.join(__dirname, "public")));

//Cors
app.use(cors());

//Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", messageRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});


//Socket io
const server = http.createServer(app);
initSocket(server);

//Error Middleware
app.use(notFound);
app.use(errorHandler);

//Start Server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on ${PORT}`);
});
