import { NextResponse } from "next/server";

const { summarizeText } = require("@/lib/tfidf-summarizer");

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const text = typeof body?.text === "string" ? body.text : "";
  const requestedSentences = Number.parseInt(body?.sentenceCount ?? "3", 10);

  if (text.trim().length < 20) {
    return NextResponse.json(
      { error: "Provide at least 20 characters of text to summarize." },
      { status: 400 }
    );
  }

  if (Number.isNaN(requestedSentences) || requestedSentences < 1 || requestedSentences > 10) {
    return NextResponse.json(
      { error: "Sentence count must be between 1 and 10." },
      { status: 400 }
    );
  }

  const result = summarizeText(text, requestedSentences);

  return NextResponse.json(result);
}
