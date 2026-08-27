import { Router } from "express";
import chatRouter from "./chat.js";
import conversationRouter from "./conversation.js";
import messageRouter from "./messages.js";

const protectedRouter = Router();

protectedRouter.use("/chat", chatRouter);
protectedRouter.use("/conversations", conversationRouter);
protectedRouter.use("/messages", messageRouter);

export default protectedRouter;
