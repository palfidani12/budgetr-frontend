import { useContext } from "react";
import { ApiContext } from "../context/api.context";

export const useApi = () => {
  const apiClient = useContext(ApiContext);
  return apiClient;
};
