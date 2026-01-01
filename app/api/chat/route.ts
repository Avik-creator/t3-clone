import { convertToModelMessages, streamText, tool } from "ai";
import prisma from "@/lib/prisma"
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums";
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompt";
import { Message } from "@/lib/generated/prisma/client";
import { NextRequest } from "next/server";
import { currentUser } from "@/app/actions/user/index";

const provider = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

function convertMessageToUI(message: Message) {
  try {
    const parts = JSON.parse(message.content);
    const validParts = parts.filter((part: any) => part.type === "text");

    if (validParts.length === 0) return null;

    return {
      id: message.id,
      role: message.messageRole.toLowerCase(),
      parts: validParts,
      createdAt: message.createdAt,
    }

  } catch (error) {
    // This is expected for messages stored as plain text during initial chat creation
    // Only log unexpected errors
    if (!(error instanceof SyntaxError && typeof message.content === 'string')) {
      console.error("Error converting message to UI:", error);
    }
    return {
      id: message.id,
      role: message.messageRole.toLowerCase(),
      parts: [{ type: "text", text: message.content }],
      createdAt: message.createdAt,
    };
  }
}

function extractPartsAsJSON(message: any) {
  if (message.parts && Array.isArray(message.parts)) {
    return JSON.stringify(message.parts);
  }

  const content = message.content || "";
  return JSON.stringify([{ type: "text", text: content }]);
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { chatId, messages: newMessages, model, skipUserMessageOnRegeneration, skipUserMessage } = await req.json();

    const previousChats = chatId ? await prisma.message.findMany({
      where: {
        chatId,
        chat: {
          userId: user.id // Ensure messages belong to the current user
        }
      },
      orderBy: { createdAt: "asc" },
    }) : [];

    const uiMessages = previousChats
      .map(convertMessageToUI)
      .filter((msg) => msg !== null);

    const normalizeNewMessages = Array.isArray(newMessages) ? newMessages : [newMessages];

    const allUIMessages = [...uiMessages, ...normalizeNewMessages];

    let modelMessages;

    try {
      modelMessages = await convertToModelMessages(allUIMessages);
    } catch (conversionError) {
      modelMessages = allUIMessages.map((msg: any) => ({
        role: msg.role,
        content: msg.parts.filter((p: any) => p.type === "text").map((p: any) => p.text).join("\n"),
      })).filter((msg: any) => msg.content.trim() !== "");
    }

    const result = streamText({
      model: provider.chat(model),
      messages: modelMessages,
      system: CHAT_SYSTEM_PROMPT,
    })

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      originalMessages: allUIMessages,
      onFinish: async ({ responseMessage }) => {
        try {
          const messagesToSave = [];
          if (!(skipUserMessage || skipUserMessageOnRegeneration)) {
            const latestUserMessage =
              normalizeNewMessages[normalizeNewMessages.length - 1];

            if (latestUserMessage?.role === "user") {
              const userPartsJSON = extractPartsAsJSON(latestUserMessage);

              messagesToSave.push({
                chatId,
                content: userPartsJSON,
                messageRole: MessageRole.USER,
                model,
                messageType: MessageType.NORMAL,
              });
            }
          }

          if (responseMessage?.parts && responseMessage.parts.length > 0) {
            const assistantPartsJSON = extractPartsAsJSON(responseMessage);

            messagesToSave.push({
              chatId,
              content: assistantPartsJSON,
              messageRole: MessageRole.ASSISTANT,
              model,
              messageType: MessageType.NORMAL,
            });
          }

          if (messagesToSave.length > 0) {
            await prisma.message.createMany({
              data: messagesToSave,
            });
          }
        } catch (error) {
          console.error("❌ Error saving messages:", error);
        }
      },
    });
  } catch (error) {
    console.error("❌ API Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorDetails,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}