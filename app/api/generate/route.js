import {
  generateOpenAIResponse,
  interactImageWithOpenAI,
  createCustomGPT,
} from '@/lib/openai-client';

export async function POST(request) {
  try {
    const { prompt, model } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'No prompt provided' }), {
        status: 400,
      });
    }

    const result = await generateOpenAIResponse(prompt, model);

    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Something went wrong' }),
      { status: 500 }
    );
  }
}

export async function POSTImage(request) {
  try {
    const { prompt, image } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'No prompt provided' }), {
        status: 400,
      });
    }

    const result = await interactImageWithOpenAI(prompt, image);

    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Something went wrong' }),
      { status: 500 }
    );
  }
}
