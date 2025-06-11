'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModels, setSelectedModel } from '@/app/store/slices/modelSlice';

export function useModels() {
  const dispatch = useDispatch();
  const { list, loading, error, selected } = useSelector(
    (state) => state.models
  );

  useEffect(() => {
    if (list.length === 0) {
      console.log('list length is', list);
      dispatch(fetchModels());
    }
  }, [dispatch, list.length]);

  return {
    models: list,
    loading,
    error,
    selectedModel: selected,
    setSelectedModel: (model) => dispatch(setSelectedModel(model)),
  };
}

// import { useEffect, useState } from 'react';

// export function useModels() {
//   const [models, setModels] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo-1106');

//   useEffect(() => {
//     setLoading(true);
//     fetch('/api/models')
//       .then((res) => res.json())
//       .then((data) => {
//         setModels(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   return { models, loading, error, selectedModel, setSelectedModel };
// }
