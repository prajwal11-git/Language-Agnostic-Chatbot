import mongoose from "mongoose";

export const chatController = async (req , res) => {
    try{
        const {conversationId}= req.query;
        if(!conversationId){
            return res.status(400).json({message:"conversationId is required"});
        }
        const messages = (await mongoose.model('Message').find({conversationId})).toSorted({createAt:1});

        res.status(200).json(messages);

    }catch(error){
        res.status(500).json({message:"Error fetching messages",error:error.message});
    }
};
