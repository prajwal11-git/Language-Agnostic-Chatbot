import express from "express";
import chatRouter from "./routes/chat.js";
import dotenv from "dotenv";
import connectToDatabase from "./database/mongodb.js";

dotenv.config();

const PORT = process.env.PORT || 5500;

const app = express();

app.use(express.json());

app.use('/api/chat',chatRouter);

app.listen(PORT, async ()=>{
    console.log(`Chat API running on http://localhost:${PORT}`);
    await connectToDatabase();
});

export default app;
