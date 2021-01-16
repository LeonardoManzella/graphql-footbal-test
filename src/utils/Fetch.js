const logger = require("../loaders/logger");
const axios = require("axios");

const REQUEST_TIMEOUT = 4 * 60 * 1000;

axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use((config) => {
  logger.silly(`[HttpClient]: Making request to URL ${config.url}`);
  logger.silly(
    `[HttpClient]: Request config ${JSON.stringify(config, null, 2)}`
  );

  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    logger.error(
      `[HttpClient]: Getting the following error: ${JSON.stringify(
        error,
        null,
        2
      )}`
    );
    return Promise.reject(error);
  }
);

class Fetch {
  defaultOptions = {
    method: "GET",
    timeout: REQUEST_TIMEOUT,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  };

  constructor(config) {
    if (config && config.username && config.password) {
      this.defaultOptions.auth = {
        username: config.username,
        password: config.password,
      };
    }
    if (config && config.token) {
      this.defaultOptions.headers = {
        Authorization: config.token,
      };
    }
    if (config && config.xAuthToken) {
      this.defaultOptions.headers = {
        "X-Auth-Token": config.xAuthToken,
      };
    }
  }

  fetch = async (url, options) => {
    options = { ...this.defaultOptions, ...options };
    let id = null;
    try {
      const abort = axios.CancelToken.source();
      const timeout = options.timeout || REQUEST_TIMEOUT;
      id = setTimeout(() => abort.cancel(`Timeout of ${timeout}ms.`), timeout);
      const response = await axios.request({
        ...options,
        url,
      });
      clearTimeout(id);
      return response.data;
    } catch (err) {
      if (err.response) {
        logger.error(
          `[HttpClient]: Getting the following error response: ${JSON.stringify(
            err.response.data,
            null,
            2
          )}`
        );
      }
      if (id) clearTimeout(id);
      throw err;
    }
  };
}

module.exports = {
  Fetch,
};
