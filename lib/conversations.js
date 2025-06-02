const BASE_URL = '/api/conversations';

export async function getAllConversations() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function getConversationByTitle(title) {
  const res = await fetch(`${BASE_URL}?title=${title}`);
  return res.json();
}

export async function createConversation({ title, messages }) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ title, messages }),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

export async function addMessagesToConversation(title, messages) {
  const res = await fetch(BASE_URL, {
    method: 'PUT',
    body: JSON.stringify({ title, messages }),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

export async function deleteConversation(title) {
  const res = await fetch(`${BASE_URL}?title=${title}`, {
    method: 'DELETE',
  });
  return res.json();
}
