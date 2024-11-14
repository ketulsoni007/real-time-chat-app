import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatApiController from "../../services/chat.service";

export const groupCreateApi = createAsyncThunk('chat/group/create', async (formValues, thunkAPI) => {
  try {
    const response = await chatApiController.groupCreate(formValues, thunkAPI);
    if (response && response.status === 200) {
      return response.data;
    } else {
      const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const chatListApi = createAsyncThunk('chat/list', async (formValues, thunkAPI) => {
  try {
    const response = await chatApiController.chatList(formValues, thunkAPI);
    if (response && response.status === 200) {
      return response.data;
    } else {
      const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const chatStoreApi = createAsyncThunk('chat/store', async (formValues, thunkAPI) => {
  try {
    const response = await chatApiController.chatStore(formValues, thunkAPI);
    if (response && response.status === 200) {
      return response.data;
    } else {
      const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const chatHistoryApi = createAsyncThunk('chat/history', async (formValues, thunkAPI) => {
  try {
    const response = await chatApiController.chatHistory(formValues, thunkAPI);
    if (response && response.status === 200) {
      return response.data;
    } else {
      const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

const initialState = {
  isOpenGroupModel: false,
  isGroupChat: false,
  isSelectedUser: "",
  isChatList: {},
  isChatHistory: [],
  isGroupModelData:{},
  isApiStatus: {
    groupCreateApi: "",
    chatListApi: "",
    chatStoreApi: "",
    chatHistoryApi: "",
  },
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    reset: () => initialState,
    OpenGroupModel: (state, action) => {
      state.isOpenGroupModel = action.payload;
    },
    GroupModelData: (state, action) => {
      state.isGroupModelData = action.payload;
    },
    SelectedUser: (state, action) => {
      state.isSelectedUser = action.payload._id;
      state.isGroupChat = action.payload.group;
    },
    MergeChats: (state, action) => {
      const existingMessageIndex = state.isChatHistory.findIndex(
        (message) => message._id === action.payload._id
      );
      if (existingMessageIndex !== -1) {
        state.isChatHistory[existingMessageIndex] = action.payload;
      } else {
        state.isChatHistory.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(chatHistoryApi.pending, (state) => {
        state.isApiStatus.chatHistoryApi = "loading";
      })
      .addCase(chatHistoryApi.fulfilled, (state, action) => {
        state.isChatHistory = action.payload;
        state.isApiStatus.chatHistoryApi = "succeeded";
      })
      .addCase(chatHistoryApi.rejected, (state) => {
        state.isChatHistory = [];
        state.isApiStatus.chatHistoryApi = "failed";
      })
      .addCase(chatStoreApi.pending, (state) => {
        state.isApiStatus.chatStoreApi = "loading";
      })
      .addCase(chatStoreApi.fulfilled, (state) => {
        state.isApiStatus.chatStoreApi = "succeeded";
      })
      .addCase(chatStoreApi.rejected, (state) => {
        state.isApiStatus.chatStoreApi = "failed";
      })
      .addCase(chatListApi.pending, (state) => {
        state.isApiStatus.chatListApi = "loading";
      })
      .addCase(chatListApi.fulfilled, (state, action) => {
        state.isChatList = action.payload;
        state.isApiStatus.chatListApi = "succeeded";
      })
      .addCase(chatListApi.rejected, (state) => {
        state.isChatList = {};
        state.isApiStatus.chatListApi = "failed";
      })
      .addCase(groupCreateApi.pending, (state) => {
        state.isApiStatus.groupCreateApi = "loading";
      })
      .addCase(groupCreateApi.fulfilled, (state) => {
        state.isApiStatus.groupCreateApi = "succeeded";
      })
      .addCase(groupCreateApi.rejected, (state) => {
        state.isApiStatus.groupCreateApi = "failed";
      });
  },
});

export const { reset, OpenGroupModel, SelectedUser,MergeChats,GroupModelData } = chatSlice.actions;
export default chatSlice.reducer;
