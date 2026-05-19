import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required: true,
    },
    content:{
        type:String,
        required:true,
    
    },
    role:{
        type:String,
        enum:['user','assistant'],
        required:true,
    },
    messageid:{
        type:String,
        required: true,
    },
},{timestamps:true});

const Message = mongoose.model('Message',messageSchema);

export default Message;