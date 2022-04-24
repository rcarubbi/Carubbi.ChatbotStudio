import axios from "axios";

const directlineApi = axios.create({
  baseURL: "http://127.0.0.1:3002"
});

export default directlineApi;
