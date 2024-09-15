import { NextRequest, NextResponse } from 'next/server';
import { config } from 'dotenv';

config();
const HF_TOKEN = process.env.BART_KEY;

export async function POST(req: NextRequest) {
  // Check if the API key is provided
  if (!HF_TOKEN) {
    return NextResponse.json({ message: 'API key not found' }, { status: 500 });
  }

  let body;
  try {
    // Parse the request body
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON payload', error: error }, { status: 400 });
  }

  const { content } = body;
  if (!content) {
    return NextResponse.json({ message: 'Content is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: content }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ message: 'Error from model API', error }, { status: response.status });
    }

    const result = (await response.json())[0].summary_text;

    // Return response with the generated summary
    if (result) {
      return NextResponse.json({ result }, { status: 200 });
    }

    return NextResponse.json({ message: 'No summary generated' }, { status: 204 });
  } catch (error) {
    console.error('Error during inference:', error);
    return NextResponse.json({ message: 'Error during inference', error }, { status: 500 });
  }
}
