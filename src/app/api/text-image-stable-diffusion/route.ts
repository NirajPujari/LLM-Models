import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { config } from 'dotenv';


config();
const HF_TOKEN = process.env.STABLE_DIFFUSION_KEY;

export async function POST(req: NextRequest) {
  if (!HF_TOKEN) {
    return NextResponse.json({ message: 'API key not found' }, { status: 500 });
  }

  const inference = new HfInference(HF_TOKEN);
  const body = await req.json()

  try {
    // Perform text-to-image inference
    const result = await inference.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: body.prompt,
    });

    if (result instanceof Blob) {
      // Convert Blob to ArrayBuffer
      const arrayBuffer = await result.arrayBuffer();
      // Convert ArrayBuffer to Buffer
      const buffer = Buffer.from(arrayBuffer);

      // Return Blob as a response with appropriate content type
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
        },
      });
    }

    // Handle case when no result is returned
    return NextResponse.json({ message: 'No image generated' }, { status: 500 });
  } catch (error) {
    console.error('Error during inference:', error);
    return NextResponse.json({ message: 'Error during inference', error: error }, { status: 500 });
  }
}