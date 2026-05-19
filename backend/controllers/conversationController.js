import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import connectToDatabase from "../database/mongodb.js";
import conversationRouter from "../routes/conversation.js";


export const conversationController = async(req,res) =>{
    try{
        const conversations = await Conversation.find().sort({createdAt : -1}).limit(10);
        res.status(200).json(conversations);
    }catch(error){
        res.status(500).json({message:"Error fetching conversations",error:error.message});
    }
}