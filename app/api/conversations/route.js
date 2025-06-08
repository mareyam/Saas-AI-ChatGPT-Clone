// app/api/conversations/route.js

let conversations = []; // In-memory store

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (title) {
    const conversation = conversations.find((c) => c.title === title);
    if (!conversation) {
      return new Response(JSON.stringify({ error: 'Conversation not found' }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(conversation), { status: 200 });
  }

  // If no title query, return all
  return new Response(JSON.stringify(conversations), { status: 200 });
}

// POST: Create new conversation with title + first messages
export async function POST(request) {
  const { title, messages } = await request.json();

  if (!title || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Title and at least one message is required' }),
      { status: 400 }
    );
  }

  const exists = conversations.find((c) => c.title === title);
  if (exists) {
    return new Response(
      JSON.stringify({ error: 'Conversation with this title already exists' }),
      { status: 409 }
    );
  }

  const newConversation = {
    id: Date.now().toString(),
    title,
    messages,
  };

  conversations.push(newConversation);
  return new Response(JSON.stringify(newConversation), { status: 201 });
}

export async function PUT(request) {
  const { id, title, messages } = await request.json();
  console.log('in put is', id, title);

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'Conversation ID is required' }),
      { status: 400 }
    );
  }

  const conversation = conversations.find((c) => c.id === id);
  if (!conversation) {
    return new Response(JSON.stringify({ error: 'Conversation not found' }), {
      status: 404,
    });
  }

  if (title) conversation.title = title;
  if (Array.isArray(messages) && messages.length > 0) {
    conversation.messages.push(...messages); // Append new messages
  }

  return new Response(
    JSON.stringify({ message: 'Conversation updated', conversation }),
    { status: 200 }
  );
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), {
      status: 400,
    });
  }

  const index = conversations.findIndex((c) => c.title === title);
  if (index === -1) {
    return new Response(JSON.stringify({ error: 'Conversation not found' }), {
      status: 404,
    });
  }

  conversations.splice(index, 1);
  return new Response(JSON.stringify({ message: 'Conversation deleted' }), {
    status: 200,
  });
}
