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

const initialState = {
  isOpenGroupModel: false,
  isChatList: {},
  isApiStatus: {
    groupCreateApi: "",
    chatListApi: "",
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
  },
  extraReducers: (builder) => {
    builder
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

export const { reset, OpenGroupModel } = chatSlice.actions;
export default chatSlice.reducer;
