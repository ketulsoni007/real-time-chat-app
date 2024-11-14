import axios from "axios";
import config from "../config";
import { appAxios } from "./appAxios";

const API_URL = config.API_URL;

const register = (values) => {
  const action = `/auth/register`;
  const formData = new FormData();

  Object.keys(values).forEach((key) => {
    if (Array.isArray(values[key])) {
      values[key].forEach((file) => {
        formData.append(key, file);
      });
    } else {
      formData.append(key, values[key]);
    }
  });

  return axios.post(API_URL + action, formData, {
    headers: {
      "Content-Type": "application/json"
    },
  });
};

const login = (values) => {
  const action = `/auth/login`;
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
  });
  return axios.post(API_URL + action, formData, {
    headers: {
      "Content-Type": "application/json"
    },
  });
};

const list = (values) => {
  const action = `/auth/user/list?name=${values?.name}`
  return appAxios.get(action);
};


const authApiController = {
  register,
  login,
  list
};

export default authApiController;