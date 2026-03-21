import axios from "axios";

const api = axios.create({
  baseURL: "https://shophub-admin-mkxj.onrender.com/api"
});

export default api;
