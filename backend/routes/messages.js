import { Router} from "express";
import {messagesController} from "../controllers/messagesController.js";

const messageRouter = Router();

messageRouter.get('/',messagesController);

export default messageRouter;