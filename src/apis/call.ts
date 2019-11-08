import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

import { getStore } from "src/stores/RootStore";

export const call = async <T>(config: AxiosRequestConfig) => {
  const headers = {
    Authorization: `JWT ${getStore().authStore.accessToken}`,
    ...config.headers
  };

  const response: AxiosResponse<T> = await axios({ ...config, headers });

  return response.data;
};
