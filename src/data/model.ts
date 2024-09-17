type modelTypeT = "text-image" | "summarization" | "image-text" | "chat-bot";

type modelT = {
  name: string;
  company: string;
  type: modelTypeT;
  link: string;
  desc: string;
};



export const Models: modelT[] = [
  {
    name: "FLUX.1-dev",
    company: "Black Forest Labs",
    type: "text-image",
    link: "text-image-black-forest",
    desc: "FLUX.1-dev is a text-to-image AI model that generates detailed images from prompts, optimized for creative tasks."
  },
  {
    name: "Stable Diffusion",
    company: "Stability AI",
    type: "text-image",
    link: "text-image-stable-diffusion",
    desc: "The stabilityai/stable-diffusion-xl-base-1.0 model is a high-resolution text-to-image generator that builds on the Stable Diffusion series, producing diverse and high-quality images from text prompts."
  },
  {
    name: "GPT 2 Image Captioning",
    company: "Open AI",
    type: "image-text",
    link: "image-text",
    desc: "The nlpconnect/vit-gpt2-image-captioning model generates descriptive captions for images by combining a vision transformer (ViT) for image understanding and GPT-2 for text generation."
  },
  {
    name: "Gemma 2 2B IT",
    company: "Google",
    type: "chat-bot",
    link: "chat-bot",
    desc: "The google/gemma-2-2b-it model is a conversational AI model designed for generating natural language responses based on input messages, supporting interactive and context-aware text completion."
  },
  {
    name: "BART-Large-CNN",
    company: "Facebook",
    type: "summarization",
    link: "summerizer",
    desc: "The facebook/bart-large-cnn model is an abstractive summarization model developed by Facebook. It is designed to generate concise summaries of large pieces of text while retaining the most important information. The model is based on the BART architecture, a transformer-based sequence-to-sequence model optimized for text summarization."
  }

];

