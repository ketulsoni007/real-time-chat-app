import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApiController from "../../services/auth.service";

export const authRegisterApi = createAsyncThunk('user/register', async (formValues, thunkAPI) => {
  try {
    const response = await authApiController.register(formValues, thunkAPI);
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

export const authLoginApi = createAsyncThunk('user/login', async (formValues, thunkAPI) => {
  try {
    const response = await authApiController.login(formValues, thunkAPI);
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
export const userListApi = createAsyncThunk('user/list', async (formValues, thunkAPI) => {
  try {
    const response = await authApiController.list(formValues, thunkAPI);
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
  isLoggedIn: false,
  user: null,
  isToken: "",
  isUserList:[],
  isApiStatus: {
    authRegisterApi: "",
    authLoginApi: "",
    userListApi:'',
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isToken = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userListApi.pending, (state) => {
        state.isApiStatus.userListApi = "loading";
      })
      .addCase(userListApi.fulfilled, (state, action) => {
        state.isUserList = action?.payload;
        state.isApiStatus.userListApi = "succeeded";
      })
      .addCase(userListApi.rejected, (state) => {
        state.isUserList = [];
        state.isApiStatus.userListApi = "failed";
      })
      .addCase(authRegisterApi.pending, (state) => {
        state.isApiStatus.authRegisterApi = "loading";
      })
      .addCase(authRegisterApi.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action?.payload?.user;
        state.isToken = action?.payload?.token;
        state.isApiStatus.authRegisterApi = "succeeded";
      })
      .addCase(authRegisterApi.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.isToken = null;
        state.isApiStatus.authRegisterApi = "failed";
      })
      .addCase(authLoginApi.pending, (state) => {
        state.isApiStatus.authLoginApi = "loading";
      })
      .addCase(authLoginApi.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.isToken = action.payload.token;
        state.isApiStatus.authLoginApi = "succeeded";
      })
      .addCase(authLoginApi.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.isToken = null;
        state.isApiStatus.authLoginApi = "failed";
      });
  },
});

export const { reset, loginSuccess, logout, tokenSetUp, RegisterStep, UserUpdate } = authSlice.actions;
export default authSlice.reducer;
