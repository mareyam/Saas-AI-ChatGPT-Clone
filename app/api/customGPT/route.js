import { createCustomGPT } from '@/lib/openai-client';

export async function POST(request) {
  try {
    const {
      name,
      description,
      instructions,
      conversationStarters,
      capabilities,
      prompt,
      model,
      temperature = 0.7,
      top_p = 1,
      max_tokens = 2048,
      frequency_penalty = 0,
      presence_penalty = 0,
      stop = [],
    } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'No prompt provided' }), {
        status: 400,
      });
    }

    const result = await createCustomGPT({
      name,
      description,
      instructions,
      conversationStarters,
      capabilities,
      prompt,
      model,
      temperature,
      top_p,
      max_tokens,
      frequency_penalty,
      presence_penalty,
      stop,
    });

    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Something went wrong' }),
      { status: 500 }
    );
  }
}
