import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatApiController from "../../services/chat.service";

// export const authRegisterApi = createAsyncThunk('user/register', async (formValues, thunkAPI) => {
//   try {
//     const response = await chatApiController.register(formValues, thunkAPI);
//     if (response && response.status === 200) {
//       return response.data;
//     } else {
//       const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
//       throw new Error(errorMessage);
//     }
//   } catch (error) {
//     const errorMessage =
//       (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//     const status = error?.response?.status ?? 410;
//     const errors = error?.response?.data?.errors ?? '';
//     return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
//   }
// });

// export const authLoginApi = createAsyncThunk('user/login', async (formValues, thunkAPI) => {
//   try {
//     const response = await chatApiController.login(formValues, thunkAPI);
//     if (response && response.status === 200) {
//       return response.data;
//     } else {
//       const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
//       throw new Error(errorMessage);
//     }
//   } catch (error) {
//     const errorMessage =
//       (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//     const status = error?.response?.status ?? 410;
//     const errors = error?.response?.data?.errors ?? '';
//     return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
//   }
// });

const initialState = {
  isOpenGroupModel: false,
  isApiStatus: {
    // authRegisterApi: "",
    // authLoginApi: "",
  },
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    reset: () => initialState,
    OpenGroupModel: (state,action) => {
      state.isOpenGroupModel = action.payload;
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(authRegisterApi.pending, (state) => {
    //     state.isApiStatus.authRegisterApi = "loading";
    //   })
    //   .addCase(authRegisterApi.fulfilled, (state, action) => {
    //     state.isLoggedIn = true;
    //     state.user = action?.payload?.user;
    //     state.isToken = action?.payload?.token;
    //     state.isApiStatus.authRegisterApi = "succeeded";
    //   })
    //   .addCase(authRegisterApi.rejected, (state) => {
    //     state.isLoggedIn = false;
    //     state.user = null;
    //     state.isToken = null;
    //     state.isApiStatus.authRegisterApi = "failed";
    //   });
  },
});

export const { reset, OpenGroupModel } = chatSlice.actions;
export default chatSlice.reducer;
