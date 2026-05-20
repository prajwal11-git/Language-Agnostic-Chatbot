import { Router} from "express";
import { getAllConversations } from "../controllers/getAllConversations.js";
import {getOneConversation} from "../controllers/getOneConversation.js";
import { get } from "mongoose";


const conversationRouter = Router();

conversationRouter.get('/',getAllConversations);
conversationRouter.get('/:id',getOneConversation);

export default conversationRouter;