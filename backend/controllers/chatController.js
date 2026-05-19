import Conversation from "../models/conversation.model.js";
import Message from "../models/messages.model.js";
import { v4 as uuidv4 } from "uuid";

export const chatController = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let activeConversationId = conversationId;
    let isNewConversation = false;

    if (!activeConversationId) {
      const newConversation = await Conversation.create({
        title: message.slice(0, 30), // simple title (improve later)
        userId: "temp-session", // replace later with real auth
      });

      activeConversationId = newConversation._id;
      isNewConversation = true;
    }

    await Message.create({
      conversationId: activeConversationId,
      userId:"temp-session",
      role: "user",
      content: message,
      messageid : uuidv4(),
    });

    const previousMessages = await Message.find({
      conversationId: activeConversationId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const reversedMessages = previousMessages.reverse();

    const formattedMessages = reversedMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    formattedMessages.unshift({
      role: "user",   
      parts: [
        {
          text: `You are a helpful college assistant chatbot. Help students with attendance, fees, certificates, and campus queries.`,
        },
      ],
    });

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: formattedMessages,
        }),
      }
    );

    const data = await geminiResponse.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    await Message.create({
      conversationId: activeConversationId,
      userId:"temp-session",
      role: "assistant",
      content: reply,
      messageid : uuidv4(),
    });

    await Conversation.findByIdAndUpdate(activeConversationId,{
    updatedAt: new Date(),
    });

    res.status(200).json({
      reply,
      conversationId: activeConversationId,
      ...(isNewConversation && { title: message.slice(0, 30) }),
    });

  } catch (error) {
    console.error("Chat controller error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};