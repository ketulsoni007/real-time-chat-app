import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./Slices/authSlice";
import chatReducer from "./Slices/chatSlice";

const reducer = combineReducers({
  auth: persistReducer(
    {
      key: "auth",
      storage,
      keyPrefix: "real-time-chat-",
      debug: false,
      whitelist: ['isLoggedIn','user','isToken'],
      timeout: 20000,
    },
    authReducer
  ),
  chat: persistReducer(
    {
      key: "chat",
      storage,
      keyPrefix: "real-time-chat-",
      debug: false,
      timeout: 20000,
    },
    chatReducer
  ),
});

export default reducer;
