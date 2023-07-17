import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
});

export const getSearchItems = async (params?: any) => {
  const response = await api.get("/sick", { params: params });

  return response.data;
};
