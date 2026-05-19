import Message from "../models/messages.model.js";

export const messagesController = async (req , res) => {
    try{
        const {conversationId}= req.query;
        if(!conversationId){
            return res.status(400).json({message:"conversationId is required"});
        }
        const messages = (await Message.find({conversationId})).sort({createAt:1});

        res.status(200).json(messages);

    }catch(error){
        res.status(500).json({message:"Error fetching messages",error:error.message});
    }
};
