let conversations = [];
// {
//   id: '1',
//   title: 'c1',
//   messages: [
//     {
//       role: 'user',
//       content: 'New message content',
//     },
//   ],
// },
// {
//   id: '2',
//   title: 'c2',
//   messages: [
//     {
//       role: 'user',
//       content: 'New message content 2',
//     },
//   ],
// },

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const conversation = conversations.find((c) => c.id === id);
    if (!conversation) {
      return new Response(JSON.stringify({ error: 'Conversation not found' }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(conversation), { status: 200 });
  }

  return new Response(JSON.stringify(conversations), { status: 200 });
}

export async function POST(request) {
  const { title, messages } = await request.json();

  if (!title || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Title and at least one message is required' }),
      { status: 400 }
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

// export async function PUT(request) {
//   const { searchParams } = new URL(request.url);
//   const idFromUrl = searchParams.get('id'); // Get id from URL
//   const { title, messages } = await request.json();

//   if (!idFromUrl) {
//     return new Response(JSON.stringify({ error: 'ID is required' }), {
//       status: 400,
//     });
//   }

//   const index = conversations.findIndex((c) => c.id === idFromUrl);
//   if (index === -1) {
//     return new Response(JSON.stringify({ error: 'Conversation not found' }), {
//       status: 404,
//     });
//   }

//   if (title) {
//     conversations[index].title = title;
//   }

//   if (Array.isArray(messages)) {
//     conversations[index].messages.push(...messages);
//   }

//   return new Response(
//     JSON.stringify({
//       message: 'Updated',
//       conversation: conversations[index],
//     }),
//     { status: 200 }
//   );
// }

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const idFromUrl = searchParams.get('id');
  const { title, messages } = await request.json();

  if (!idFromUrl) {
    return new Response(JSON.stringify({ error: 'ID is required' }), {
      status: 400,
    });
  }

  const index = conversations.findIndex((c) => c.id === idFromUrl);
  if (index === -1) {
    return new Response(JSON.stringify({ error: 'Conversation not found' }), {
      status: 404,
    });
  }

  // ✅ Update title if provided
  if (typeof title === 'string' && title.trim() !== '') {
    conversations[index].title = title.trim();
  }

  // ✅ Append messages if provided and valid
  if (Array.isArray(messages) && messages.length > 0) {
    conversations[index].messages.push(...messages);
  }

  return new Response(
    JSON.stringify({
      message: 'Updated',
      conversation: conversations[index],
    }),
    { status: 200 }
  );
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), {
      status: 400,
    });
  }

  const index = conversations.findIndex((c) => c.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: 'Conversation not found' }), {
      status: 404,
    });
  }

  conversations.splice(index, 1);
  return new Response(JSON.stringify({ message: 'Deleted' }), {
    status: 200,
  });
}
