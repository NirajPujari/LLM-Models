import { NextRequest, NextResponse } from 'next/server';
import { config } from 'dotenv';

config();
const HF_TOKEN = process.env.BART_KEY;

if (!HF_TOKEN) {
  throw new Error("Hugging Face API key (BART_KEY) is missing from environment variables.");
}

export async function POST(req: NextRequest) {
  let body;

  try {
    // Parse the incoming request body
    body = await req.json();
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
  }

  const { content } = body;

  if (!content || typeof content !== 'string') {
    return NextResponse.json({ message: 'Content must be a non-empty string' }, { status: 400 });
  }

  const data = content.trim();
  const maxLength = Math.floor(data.length / 10) > 500 ? 500 : Math.floor(data.length / 10);
  const minLength = maxLength === 500 ? 250 : Math.floor(data.length / 12);
  console.log(`Processing content with length: ${data.length} (min: ${minLength}, max: ${maxLength})`);

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: data,
          parameters: {
            min_length: minLength,
            max_length: maxLength,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Model API error:", errorData);
      return NextResponse.json(
        { message: 'Data Too Large', error: errorData },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    const summary = responseData[0]?.summary_text;

    if (summary) {
      return NextResponse.json({ result: summary }, { status: 200 });
    } else {
      console.warn("Empty summary received from the model.");
      return NextResponse.json({ message: 'No summary generated' }, { status: 204 });
    }
  } catch (error) {
    console.error("Error during inference:", error);
    return NextResponse.json({ message: 'Error during inference', error }, { status: 500 });
  }
}
