import axios from "axios";
import config from "../config";
import { appAxios } from "./appAxios";

const groupCreate = (values) => {
  const action = `/chat/group/store`
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    if (Array.isArray(values[key])) {
      formData.append(key, JSON.stringify(values[key]));
    } else {
      formData.append(key, values[key]);
    }
  });

  return appAxios.post(action, formData, {
    headers: {
     "Content-Type": "application/json",
    },
  });
};

const chatList = (values) => {
  const action = `/chat/alluser/list?name=${values?.name}`
  return appAxios.get(action);
};


const chatApiController = {
  groupCreate,
  chatList
};

export default chatApiController;