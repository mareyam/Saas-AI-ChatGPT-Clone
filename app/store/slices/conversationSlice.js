import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = '/api/conversations';

// Thunks for async actions

export const fetchConversations = createAsyncThunk(
  'conversation/fetchConversations',
  async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return await res.json();
  }
);

export const fetchConversationByTitle = createAsyncThunk(
  'conversation/fetchConversationByTitle',
  async (title) => {
    const res = await fetch(`${BASE_URL}?title=${encodeURIComponent(title)}`);
    if (!res.ok) throw new Error('Failed to fetch conversation by title');
    return await res.json();
  }
);

export const createConversation = createAsyncThunk(
  'conversation/createConversation',
  async ({ title, messages }, thunkAPI) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({ title, messages }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const errorData = await res.json();
      return thunkAPI.rejectWithValue(errorData);
    }
    const data = await res.json();
    thunkAPI.dispatch(fetchConversations()); // refresh list after create
    return data;
  }
);

export const addMessagesToConversation = createAsyncThunk(
  'conversation/addMessagesToConversation',
  async ({ title, messages }, thunkAPI) => {
    const res = await fetch(BASE_URL, {
      method: 'PUT',
      body: JSON.stringify({ title, messages }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const errorData = await res.json();
      return thunkAPI.rejectWithValue(errorData);
    }
    const data = await res.json();
    thunkAPI.dispatch(fetchConversations()); // refresh list after update
    return data;
  }
);

export const deleteConversation = createAsyncThunk(
  'conversation/deleteConversation',
  async (title, thunkAPI) => {
    const res = await fetch(`${BASE_URL}?title=${encodeURIComponent(title)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errorData = await res.json();
      return thunkAPI.rejectWithValue(errorData);
    }
    const data = await res.json();
    thunkAPI.dispatch(fetchConversations()); // refresh list after delete
    return data;
  }
);

// The slice

const conversationSlice = createSlice({
  name: 'conversation',
  initialState: {
    conversations: [],
    selectedConversation: null,
    msg: null,
    currConvo: null,
    loading: false,
    error: null,
  },
  reducers: {
    setMsg: (state, action) => {
      state.msg = action.payload;
    },
    setCurrConvo: (state, action) => {
      state.currConvo = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.loading = false;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch conversations';
      })

      // fetchConversationByTitle
      .addCase(fetchConversationByTitle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationByTitle.fulfilled, (state, action) => {
        state.selectedConversation = action.payload;
        state.loading = false;
      })
      .addCase(fetchConversationByTitle.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch conversation by title';
      })

      // createConversation
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        // state.conversations updated by fetchConversations thunk dispatched inside createConversation
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.error.message ||
          'Failed to create conversation';
      })

      // addMessagesToConversation
      .addCase(addMessagesToConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessagesToConversation.fulfilled, (state, action) => {
        state.loading = false;
        // conversations refreshed by fetchConversations thunk
      })
      .addCase(addMessagesToConversation.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.error.message ||
          'Failed to add messages';
      })

      // deleteConversation
      .addCase(deleteConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.loading = false;
        // conversations refreshed by fetchConversations thunk
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.error.message ||
          'Failed to delete conversation';
      });
  },
});

export const { setMsg, setCurrConvo, clearError } = conversationSlice.actions;
export default conversationSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// const BASE_URL = '/api/conversations';

// // Thunks
// export const fetchConversations = createAsyncThunk(
//   'conversation/fetchAll',
//   async () => {
//     const res = await fetch(BASE_URL);
//     return await res.json();
//   }
// );

// export const fetchConversationByTitle = createAsyncThunk(
//   'conversation/fetchByTitle',
//   async (title) => {
//     const res = await fetch(`${BASE_URL}?title=${title}`);
//     return await res.json();
//   }
// );

// export const createConversation = createAsyncThunk(
//   'conversation/create',
//   async ({ title, messages }, thunkAPI) => {
//     const res = await fetch(BASE_URL, {
//       method: 'POST',
//       body: JSON.stringify({ title, messages }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     const data = await res.json();
//     thunkAPI.dispatch(fetchConversations());
//     return data;
//   }
// );

// export const addMessagesToConversation = createAsyncThunk(
//   'conversation/addMessages',
//   async ({ title, messages }, thunkAPI) => {
//     const res = await fetch(BASE_URL, {
//       method: 'PUT',
//       body: JSON.stringify({ title, messages }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     const data = await res.json();
//     thunkAPI.dispatch(fetchConversations());
//     return data;
//   }
// );

// export const deleteConversation = createAsyncThunk(
//   'conversation/delete',
//   async (title, thunkAPI) => {
//     const res = await fetch(`${BASE_URL}?title=${title}`, {
//       method: 'DELETE',
//     });
//     const data = await res.json();
//     thunkAPI.dispatch(fetchConversations());
//     return data;
//   }
// );

// const conversationSlice = createSlice({
//   name: 'conversation',
//   initialState: {
//     conversations: [],
//     selectedConversation: null,
//     msg: null,
//     currConvo: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     setMsg: (state, action) => {
//       state.msg = action.payload;
//     },
//     setCurrConvo: (state, action) => {
//       state.currConvo = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchConversations.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchConversations.fulfilled, (state, action) => {
//         state.conversations = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchConversations.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error;
//       })

//       .addCase(fetchConversationByTitle.fulfilled, (state, action) => {
//         state.selectedConversation = action.payload;
//       })

//       .addCase(createConversation.rejected, (state, action) => {
//         state.error = action.error;
//       })

//       .addCase(addMessagesToConversation.rejected, (state, action) => {
//         state.error = action.error;
//       })

//       .addCase(deleteConversation.rejected, (state, action) => {
//         state.error = action.error;
//       });
//   },
// });

// export const { setMsg, setCurrConvo } = conversationSlice.actions;
// export default conversationSlice.reducer;

// // import { createSlice } from '@reduxjs/toolkit';

// // const initialState = {
// //   conversations: [], // Array of { id, title, messages: [] }
// // };

// // const conversationSlice = createSlice({
// //   name: 'conversation',
// //   initialState,
// //   reducers: {
// //     addConversation: (state, action) => {
// //       const { id, title } = action.payload;
// //       state.conversations.push({ id, title, messages: [] });
// //     },
// //     addMessageToConversation: (state, action) => {
// //       const { id, message } = action.payload;
// //       const convo = state.conversations.find((c) => c.id === id);
// //       if (convo) {
// //         convo.messages.push(message);
// //       }
// //     },
// //     deleteConversation: (state, action) => {
// //       state.conversations = state.conversations.filter(
// //         (c) => c.id !== action.payload
// //       );
// //     },
// //   },
// // });

// // export const { addConversation, addMessageToConversation, deleteConversation } =
// //   conversationSlice.actions;
// // export default conversationSlice.reducer;
