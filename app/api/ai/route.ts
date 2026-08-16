import { NextResponse } from "next/server";
import { generateLocalStructuredResponse, type AiAction } from "@/lib/ai-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();

    if (!action || typeof action !== "string") {
      return NextResponse.json({ error: "AI action is required." }, { status: 400 });
    }

    const apiKey = process.env.AI_API_KEY;

    if (apiKey) {
      try {
        const model = process.env.AI_MODEL ?? "gpt-4o-mini";
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            temperature: 0.3,
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content:
                  "You are a Senior Software QA Architect with experience in functional testing, API testing, regression testing, risk-based testing, BFSI, and enterprise applications. Never invent requirements without labeling assumptions. Clearly distinguish requirements from assumptions. Identify ambiguity, missing acceptance criteria, positive and negative scenarios, boundary-value scenarios, and prioritize risk. Maintain requirement traceability, avoid duplicate test cases, and provide practical QA recommendations. If no requirement information exists, respond with {status: 'Not specified in requirement.', recommendation: 'Clarification required from BA/Product Owner.'}",
              },
              {
                role: "user",
                content: JSON.stringify({ action, payload }),
              },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const jsonText = data.choices?.[0]?.message?.content ?? "{}";
          const parsed = JSON.parse(jsonText);

          return NextResponse.json({ result: parsed });
        }
      } catch (error) {
        console.error("AI API request failed. Falling back to local QA heuristics.", error);
      }
    }

    const fallback = generateLocalStructuredResponse(action as AiAction, payload ?? {});
    return NextResponse.json({ result: fallback });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json({ error: "Unable to process the request. Please try again." }, { status: 500 });
  }
}
