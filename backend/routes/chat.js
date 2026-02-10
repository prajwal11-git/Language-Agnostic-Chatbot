import { Router } from "express";

const chatRouter = Router();

chatRouter.post('/',(req,res) => { res.send({title : "Chat api called"})});

chatRouter.get('/',(req,res) => { res.send({title : "Chat api called"})});

export default chatRouter;