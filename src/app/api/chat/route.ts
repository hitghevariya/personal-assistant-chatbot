import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

    // Build the conversation messages for Gemini
    const messages = [
      ...conversationHistory,
      { role: "user", content: message },
    ];

    // Prepare Gemini API request
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 500 }
      );
    }

    const geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    const geminiRequestBody = {
      contents: [
        {
          parts: [
            { text: messages.map((m) => `${m.role}: ${m.content}`).join("\n") },
          ],
        },
      ],
    };

    const geminiResponse = await fetch(geminiApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify(geminiRequestBody),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.log("Gemini API error details:", errorData);
      return NextResponse.json(
        { error: "Gemini API error", details: errorData },
        { status: 500 }
      );
    }

    const geminiData = await geminiResponse.json();
    const assistantResponse =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
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

    // Generic error response
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
