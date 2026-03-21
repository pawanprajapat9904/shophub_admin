import axios from "axios";

const api = axios.create({
  baseURL: "https://shophub-ecommerce-yzwp.onrender.com/api"
});

export default api;
