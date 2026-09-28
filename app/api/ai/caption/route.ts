import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { eventTitle, eventDate, eventCity, eventDescription, platforms } = await req.json();
    const platformList = platforms.join(", ");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a social media manager for live events. Write punchy, scroll-stopping captions. Use 1-2 emojis per caption. Include a call to action. Keep captions under 200 characters unless the platform needs more.",
        },
        {
          role: "user",
          content: "Write social media captions for this event:\\n\\nTitle: " + eventTitle + "\\nDate: " + eventDate + "\\nCity: " + eventCity + "\\nDescription: " + eventDescription + "\\n\\nPlatforms: " + platformList + "\\n\\nFor each platform, write a caption tailored to that platform style. Return each caption clearly labelled with the platform name.",
        },
      ],
      max_tokens: 800,
    });

    const caption = completion.choices[0].message.content || "";
    return NextResponse.json({ caption });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
