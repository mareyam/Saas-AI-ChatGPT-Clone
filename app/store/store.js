import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from './slices/conversationSlice';

export const store = configureStore({
  reducer: {
    conversation: conversationReducer,
  },
});
