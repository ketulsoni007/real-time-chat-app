import axios from "axios";
import config from "../config";
import { appAxios } from "./appAxios";
// import {store} from "../store";

const API_URL = config.API_URL;
// // const token = store.getState().auth.isToken;
// const storage = localStorage.getItem('estate-client-auth');
// const tokenData = JSON.parse(storage);
// const token = tokenData?.isToken ?? null;
// console.log('tokenData: ', token);

const register = (values) => {
  const action = `/auth/register`;
  const formData = new FormData();

  // Append each key-value pair to the FormData object
  Object.keys(values).forEach((key) => {
    if (Array.isArray(values[key])) {
      values[key].forEach((file) => {
        formData.append(key, file);
      });
    } else {
      formData.append(key, values[key]);
    }
  });
  formData.append('requests', 'client');
  // Note: Do not set Content-Type header for FormData; Axios handles it
  return axios.post(API_URL + action, formData, {
    headers: {
      "Content-Type": "application/json"
    },
  });
};

const profilesUpdates = (values) => {
  const action = `/auth/update`;
  const formData = new FormData();

  // Append each key-value pair to the FormData object
  Object.keys(values).forEach((key) => {
    if (Array.isArray(values[key])) {
      values[key].forEach((file) => {
        formData.append(key, file);
      });
    } else {
      formData.append(key, values[key]);
    }
  });

  // Note: Do not set Content-Type header for FormData; Axios handles it
  return axios.post(API_URL + action, formData, {
    headers: {
      "Authorization": `Bearer ${values?.token}`
    },
  }
  );
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

const roles = (values) => {
  const action = `/auth/roles`;
  return axios.get(API_URL + action);
};

const update = (formData, token) => {
  const id = formData && formData.id ? formData.id : "";
  const action = `/user/update-user/${id}`;

  return axios.put(API_URL + action, formData, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
};

const logoutservice = (token) => {
  return appAxios.get('/auth/logout');
};

const passwords = (formData) => {
  const id = formData && formData.id ? formData.id : "";
  const action = `/auth/password`;

  return axios.post(API_URL + action, formData, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${formData?.token}`
    },
  });
};


const authApiController = {
  register,
  login,
  logoutservice,
  roles,
  profilesUpdates,
  update,
  passwords
};

export default authApiController;