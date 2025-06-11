import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from './slices/conversationSlice';
import modelsReducer from './slices/modelSlice';

export const store = configureStore({
  reducer: {
    conversation: conversationReducer,
    models: modelsReducer,
  },
});
