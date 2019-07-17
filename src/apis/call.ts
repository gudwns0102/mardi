import axios, { AxiosRequestConfig } from "axios";
import _ from "lodash";

import { getStore } from "src/stores/RootStore";

export const call = async (config: AxiosRequestConfig) => {
  const headers = {
    Authorization: `JWT ${getStore().authStore.accessToken}`,
    ...config.headers
  };

  const response = await axios({ ...config, headers });

  return response.data;
};
