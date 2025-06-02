'use client';
import { useEffect, useState } from 'react';

const BASE_URL = '/api/conversations';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState();
  const [currConvo, setCurrConvo] = useState();
  const [selectedConversation, setSelectedConversation] = useState(null);

  // GET all conversations
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      console.log('data fetchConversations', data);
      setConversations(data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // GET conversation by title
  const fetchConversationByTitle = async (title) => {
    console.log('data fetchConversations', title);

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}?title=${title}`);
      const data = await res.json();
      setSelectedConversation(data);
      console.log('selectedConversation', selectedConversation);
      return data;
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // POST new conversation
  const createConversation = async ({ title, messages }) => {
    console.log('data createConversation', title);

    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify({ title, messages }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      fetchConversations(); // refresh list
      return data;
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  // PUT to add messages
  const addMessagesToConversation = async (title, messages) => {
    console.log('data addMessagesToConversation', title);

    try {
      const res = await fetch(BASE_URL, {
        method: 'PUT',
        body: JSON.stringify({ title, messages }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      fetchConversations();
      return data;
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  // DELETE conversation
  const deleteConversation = async (title) => {
    console.log('data deleteConversation', title);

    try {
      const res = await fetch(`${BASE_URL}?title=${title}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      console.log('data ', data);
      fetchConversations();
      return data;
    } catch (err) {
      console.error('err');
      setError(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    error,
    fetchConversationByTitle,
    createConversation,
    addMessagesToConversation,
    deleteConversation,
    msg,
    setMsg,
    currConvo,
    setCurrConvo,
    selectedConversation
  };
}
