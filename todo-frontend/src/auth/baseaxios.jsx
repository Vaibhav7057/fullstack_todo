import axios from "axios";

const BASE_URL = "https://todobackend-3gdj.onrender.com";

export default axios.create({
  baseURL: BASE_URL,
});
