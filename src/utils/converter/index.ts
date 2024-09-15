export async function blobToString(blob: Blob): Promise<string> {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('utf-8');
  } catch (error) {
    console.error('Error converting blob to string:', error);
    throw new Error('Blob conversion failed');
  }
}

export function stringToBlob(str: string, mimeType: string = 'text/plain'): Blob {
  return new Blob([str], { type: mimeType });
}