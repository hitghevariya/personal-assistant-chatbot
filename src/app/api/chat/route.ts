import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zod validation schema for the request body
const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").trim(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = chatRequestSchema.parse(body);

    const { message, conversationHistory } = validatedData;

    // Build the conversation messages for OpenAI
    const messages = [
      {
        role: "system" as const,
        content:
          "You are a helpful assistant. Provide clear, concise, and helpful responses.",
      },
      // Include previous conversation history
      ...conversationHistory,
      // Add the new user message
      {
        role: "user" as const,
        content: message,
      },
    ];

    // Call OpenAI API with the conversation history
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const assistantResponse =
      completion.choices[0]?.message?.content ||
      "I apologize, but I cannot generate a response at the moment.";

    // Return the response
    return NextResponse.json({
      message: assistantResponse,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    // Handle OpenAI API errors
    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        { error: "OpenAI API configuration error" },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
