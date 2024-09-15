import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { config } from 'dotenv';

config();
const HF_TOKEN = process.env.GPT2_IMAGE_KEY;

export async function POST(req: NextRequest) {
  if (!HF_TOKEN) {
    return NextResponse.json({ message: 'API key not found' }, { status: 500 });
  }
  const imageFile = (await req.formData()).get("image");
  const inference = new HfInference(HF_TOKEN);

  try {
    // Perform text-to-image inference
    const result = await inference.imageToText({
      data: imageFile,
      model: 'nlpconnect/vit-gpt2-image-captioning',
    })

    if (result) {
      return NextResponse.json(result, { status: 200 })
    }

    // Handle case when no result is returned
    return NextResponse.json({ message: 'No image generated' }, { status: 500 });
  } catch (error) {
    console.error('Error during inference:', error);
    return NextResponse.json({ message: 'Error during inference', error: error }, { status: 500 });
  }
}