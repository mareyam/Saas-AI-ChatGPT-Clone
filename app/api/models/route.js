import { openai } from '@/lib/openai-client';

export async function GET() {
  try {
    const response = await openai.models.list();
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
