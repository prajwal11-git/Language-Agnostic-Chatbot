import { Router } from "express";
import { chatController } from "../controllers/chatController.js";


const chatRouter = Router();

chatRouter.post('/',chatController);

chatRouter.get('/',(req,res) => { res.send({title : "Chat api called"})});

export default chatRouter;