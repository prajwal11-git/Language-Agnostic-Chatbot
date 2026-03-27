import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    conversationId:{
        type: String,
        required: true,
    },
    userId:{
        type:String,
        required: true,
    },
    accessType:{
        type:String,
        enum: ['student','faculty','admin'],
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    isArchived:{
        type:Boolean,
        default:false,
    }
},{timestamps:true});

const conversation = mongoose.model('Conversation',conversationSchema);

export default conversation;