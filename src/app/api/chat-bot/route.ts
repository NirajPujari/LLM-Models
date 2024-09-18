import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { config } from 'dotenv';

config();
const HF_TOKEN = process.env.META_LLAMA_KEY;

export async function POST(req: NextRequest) {
  if (!HF_TOKEN) {
    return NextResponse.json({ message: 'API key not found' }, { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
  }

  const { content } = body;
  if (!content) {
    return NextResponse.json({ message: 'Role and content are required' }, { status: 400 });
  }

  const inference = new HfInference(HF_TOKEN);

  try {
    var result = ''
    console.log('Input content:', content);

    // Stream response from the model
    for await (const chunk of inference.chatCompletionStream({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [{ role: "user", content: content }],
      max_tokens: 500,
    })) {
      result += chunk.choices[0]?.delta?.content || '';
    }
    if (result) {
      return NextResponse.json({ result }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No text generated' }, { status: 204 });
    }
  } catch (error) {
    console.error('Error during inference:', error);
    return NextResponse.json({ message: 'Error during inference', error: error }, { status: 500 });
  }
}
