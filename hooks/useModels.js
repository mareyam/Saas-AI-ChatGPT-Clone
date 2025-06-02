'use client';
import { useEffect, useState } from 'react';

export function useModels() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo-1106');

  useEffect(() => {
    setLoading(true);
    fetch('/api/models')
      .then((res) => res.json())
      .then((data) => {
        setModels(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { models, loading, error, selectedModel, setSelectedModel };
}
