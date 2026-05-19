import { Router} from "express";
import { conversationController } from "../controllers/conversationController.js";

const conversationRouter = Router();

conversationRouter.get('/',conversationController);

export default conversationRouter;