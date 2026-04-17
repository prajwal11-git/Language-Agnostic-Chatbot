import express from "express";
import chatRouter from "./routes/chat.js";
import dotenv from "dotenv";
import connectToDatabase from "./database/mongodb.js";
import conversationRouter from "./routes/conversation.js";
import messageRouter from "./routes/messages.js";


dotenv.config();

const PORT = process.env.PORT || 5500;

const app = express();

app.use(express.json());

app.use('/api/chat',chatRouter);
app.use('/api/conversations',conversationRouter);
app.use('/api/messages',messageRouter);


app.listen(PORT, async ()=>{
    console.log(`Chat API running on http://localhost:${PORT}`);
    await connectToDatabase();
});

export default app;
