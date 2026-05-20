import Conversation from "../models/conversation.model.js";
import Message from "../models/messages.model.js";
import { v4 as uuidv4 } from "uuid";

export const chatController = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    let activeConversationId = conversationId;
    let isNewConversation = false;

    
    if (!activeConversationId) {
      const newConversation = await Conversation.create({
        title: message.slice(0, 30),
        userId: "temp-session",
      });

      activeConversationId = newConversation._id;
      isNewConversation = true;
    }

    
    await Message.create({
      conversationId: activeConversationId,
      userId: "temp-session",
      role: "user",
      content: message,
      messageid: uuidv4(),
    });

    
    const previousMessages = await Message.find({
      conversationId: activeConversationId,
    })
      .sort({ createdAt: 1 })
      .limit(10)
      .lean();

    
    const formattedMessages = previousMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

   
    formattedMessages.unshift({
      role: "user",
      parts: [
        {
          text: `
You are a helpful college assistant chatbot.
Help students with:
- attendance
- fees
- certificates
- campus queries
`,
        },
      ],
    });

   
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

      
    res.setHeader(
      "x-conversation-id",
      activeConversationId.toString()
    );

    if (isNewConversation) {
      res.setHeader(
        "x-conversation-title",
        message.slice(0, 30)
      );
    }



    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse",
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

    if (!geminiResponse.ok) {
      throw new Error("Gemini API request failed");
    }

    
    const reader = geminiResponse.body.getReader();

    const decoder = new TextDecoder();

    let fullReply = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);

      
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const jsonString = line.replace("data: ", "").trim();

        if (!jsonString) continue;

        try {
          const parsed = JSON.parse(jsonString);

          const text =
            parsed?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (text) {
            
            fullReply += text;

            
            res.write(text);
          }
        } catch (error) {
          console.error("SSE Parse Error:", error);
        }
      }
    }

    
    await Message.create({
      conversationId: activeConversationId,
      userId: "temp-session",
      role: "assistant",
      content: fullReply,
      messageid: uuidv4(),
    });

    
    await Conversation.findByIdAndUpdate(activeConversationId, {
      updatedAt: new Date(),
    });

   
    res.end();

  } catch (error) {
    console.error("Chat controller error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.end();
    }
  }
};