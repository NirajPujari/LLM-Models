import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { config } from 'dotenv';

config();
const HF_TOKEN = process.env.GEMMA_KEY;

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

  // Check for role and content in the body
  const { role, content } = body;
  if (!role || !content) {
    return NextResponse.json({ message: 'Role and content are required' }, { status: 400 });
  }

  const inference = new HfInference(HF_TOKEN);

  try {
    let result = '';
    // Stream response from the model
    for await (const chunk of inference.chatCompletionStream({
      model: 'google/gemma-2-2b-it',
      messages: [{ role, content }],
    })) {
      const chunkContent = chunk.choices?.[0]?.delta?.content || '';
      result += chunkContent;
    }

    // Return the generated result
    if (result) {
      return NextResponse.json({ result }, { status: 200 });
    }
    return NextResponse.json({ message: 'No text generated' }, { status: 204 });


  } catch (error) {
    console.error('Error during inference:', error);
    return NextResponse.json({ message: 'Error during inference', error: error }, { status: 500 });
  }
}
