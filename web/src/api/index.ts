/**
 * @file axios 封装
 * @author
 */

import axios, { type AxiosInstance } from 'axios';
import cookie from 'cookie';

import CachedPromise from './cached-promise';
import RequestQueue from './request-queue';
// import { bus } from '@/common/bus';
import { Message } from 'bkui-vue';

// axios 实例
export const axiosInstance: AxiosInstance = axios.create({
  withCredentials: true,
  headers: { 'X-REQUESTED-WITH': 'XMLHttpRequest' },
  // xsrf token 的值的 cookie 的名称，默认为 XSRF-TOKEN
  xsrfCookieName: 'bkom_csrftoken',
  // xsrf token 的值的 HTTP 头的名称，默认为 X-XSRF-TOKEN
  xsrfHeaderName: 'X-CSRFToken',
});

/**
 * request interceptor
 */
axiosInstance.interceptors.request.use(
  (config: any) =>
  // const urlObj = new UrlParse(config.url);
  // const query = queryString.parse(urlObj.query as any);
  // if (AJAX_MOCK_PARAM && query[AJAX_MOCK_PARAM]) {
  //   // 直接根路径没有 pathname，例如 http://localhost:LOCAL_DEV_PORT/?mock-file=index&invoke=btn1&btn=btn1
  //   // axios get 请求不会请求到 devserver，因此在 pathname 不存在或者为 / 时，加上一个 /mock 的 pathname
  //   if (!urlObj.pathname) {
  //     config.url = `${LOCAL_DEV_URL}:${LOCAL_DEV_PORT}/mock/${urlObj.query}`;
  //   } else if (urlObj.pathname === '/') {
  //     config.url = `${LOCAL_DEV_URL}:${LOCAL_DEV_PORT}/mock/${urlObj.query}`;
  //   } else if (LOCAL_DEV_URL && LOCAL_DEV_PORT) {
  //     config.url = `${LOCAL_DEV_URL}:${LOCAL_DEV_PORT}${urlObj.pathname}${urlObj.query}`;
  //   } else if (LOCAL_DEV_URL) {
  //     config.url = `${LOCAL_DEV_URL}${urlObj.pathname}${urlObj.query}`;
  //   }
  // }

    // 在发起请求前，注入CSRFToken，解决跨域
    // injectCSRFTokenToHeaders();
    config,
  error => Promise.reject(error),
);

/**
 * response interceptor
 */
axiosInstance.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error),
);

const http: HttpApi = {
  queue: new RequestQueue(),
  cache: new CachedPromise(),
  cancelRequest: (requestId: string) => http.queue.cancel(requestId),
  cancelCache: (requestId: string) => http.cache.delete(requestId),
  cancel: (requestId: string) => Promise.all([http.cancelRequest(requestId), http.cancelCache(requestId)]),
};

const methodsWithoutData: HttpMethodType[] = ['delete', 'get', 'head', 'options'];
const methodsWithData: HttpMethodType[] = ['post', 'put', 'patch'];
const allMethods = [...methodsWithoutData, ...methodsWithData];

// 在自定义对象 http 上添加各请求方法
allMethods.forEach((method) => {
  Object.defineProperty(http, method, {
    get() {
      return getRequest(method);
    },
  });
});

/**
 * 获取 http 不同请求方式对应的函数
 *
 * @param {string} http method 与 axios 实例中的 method 保持一致
 *
 * @return {Function} 实际调用的请求函数
 */
function getRequest(method: HttpMethodType) {
  if (methodsWithData.includes(method)) {
    return (url: string, data: any, config: any) => getPromise(method, url, data, config);
  }
  return (url: string, config: any) => getPromise(method, url, null, config);
}

/**
 * 实际发起 http 请求的函数，根据配置调用缓存的 promise 或者发起新的请求
 *
 * @param {method} http method 与 axios 实例中的 method 保持一致
 * @param {string} 请求地址
 * @param {Object} 需要传递的数据, 仅 post/put/patch 三种请求方式可用
 * @param {Object} 用户配置，包含 axios 的配置与本系统自定义配置
 *
 * @return {Promise} 本次http请求的Promise
 */
async function getPromise(method: HttpMethodType, url: string, data: any | null, userConfig = {}) {
  const config = initConfig(method, url, userConfig);
  let promise;
  if (config.cancelPrevious) {
    await http.cancel(config.requestId);
  }

  if (config.clearCache) {
    http.cache.delete(config.requestId);
  } else {
    promise = http.cache.get(config.requestId);
  }
  if (config.fromCache && promise) {
    return promise;
  }

  // eslint-disable-next-line no-async-promise-executor
  // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
  promise = new Promise(async (resolve, reject) => {
    const axiosRequest = methodsWithData.includes(method)
      ? axiosInstance[method](url, data, config)
      : axiosInstance[method](url, config);

    try {
      const response = await axiosRequest;
      Object.assign(config, response.config || {});
      handleResponse({ config, response, resolve, reject });
    } catch (error) {
      Object.assign(config, (error as any).config);
      reject(error);
    }
  })
    .catch(error => handleReject(error, config))
    .finally(() => {
      // console.log('finally', config)
    });

  // 添加请求队列
  http.queue.set(config);
  // 添加请求缓存
  http.cache.set(config.requestId, promise);

  return promise;
}

/**
 * 处理 http 请求成功结果
 *
 * @param {Object} 请求配置
 * @param {Object} cgi 原始返回数据
 * @param {Function} promise 完成函数
 * @param {Function} promise 拒绝函数
 */
function handleResponse(params: { config: any; response: any; resolve: any; reject: any }) {
  // if (
  //   !params.response.data
  // eslint-disable-next-line max-len
  //     && (params.response.code !== 'ok' && params.response.code !== 'OK' && params.response.code !== 0  && params.response.ok !== true)
  //     && params.config.globalError
  // ) {
  //   params.reject({ code: params.response.code, message: params.response.message });
  // } else {
  params.resolve(params.config.originalResponse ? params.response : params.response.data, params.config);
  // }
  http.queue.delete(params.config.requestId);
}

/**
 * 处理 http 请求失败结果
 *
 * @param {Object} Error 对象
 * @param {config} 请求配置
 *
 * @return {Promise} promise 对象
 */
function handleReject(error: any, config: any) {
  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }

  http.queue.delete(config.requestId);

  if (config.globalError && error.code === 40300) {
    // bus.$emit('show-forbidden', { message: error.message });
    return Promise.reject(error);
  }

  if (config.globalError && error.response) {
    const { status, data } = error.response;
    const nextError = { message: error.message, response: error.response };
    if (status === 401) {
      // bus.$emit('show-login-modal', nextError.response);
    } else if (status === 403) {
      // bus.$emit('show-forbidden')
      if (error.response.data.code === 'PERMISSION_DENIED') {
        // bus.$emit('no-auth-view-receipt', { message: error.response.data.message });
      } else {
        // bus.$emit('show-forbidden');
      }
    } else if (status === 500) {
      nextError.message = '系统出现异常';
    } else if (data?.message) {
      nextError.message = data.message;
    }
    Message({ theme: 'error', message: nextError.message });
    return Promise.reject(nextError);
  }
  Message({ theme: 'error', message: error.message });
  return Promise.reject(error);
}

/**
 * 初始化本系统 http 请求的各项配置
 *
 * @param {string} http method 与 axios 实例中的 method 保持一致
 * @param {string} 请求地址, 结合 method 生成 requestId
 * @param {Object} 用户配置，包含 axios 的配置与本系统自定义配置
 *
 * @return {Promise} 本次 http 请求的 Promise
 */
function initConfig(method: string, url: string, userConfig: any) {
  const defaultConfig = {
    ...getCancelToken(),
    // http 请求默认 id
    requestId: `${method}_${url}`,
    // 是否全局捕获异常
    globalError: true,
    // 是否直接复用缓存的请求
    fromCache: false,
    // 是否在请求发起前清楚缓存
    clearCache: false,
    // 响应结果是否返回原始数据
    originalResponse: true,
    // 当路由变更时取消请求
    cancelWhenRouteChange: true,
    // 取消上次请求
    cancelPrevious: true,
  };
  return Object.assign(defaultConfig, userConfig);
}

/**
 * 生成 http 请求的 cancelToken，用于取消尚未完成的请求
 *
 * @return {Object} {cancelToken: axios 实例使用的 cancelToken, cancelExcutor: 取消http请求的可执行函数}
 */
function getCancelToken() {
  let cancelExcutor;
  const cancelToken = new axios.CancelToken((excutor) => {
    cancelExcutor = excutor;
  });
  return {
    cancelToken,
    cancelExcutor,
  };
}

export default http;

/**
 * 向 http header 注入 CSRFToken，CSRFToken key 值与后端一起协商制定
 */
export function injectCSRFTokenToHeaders() {
  const csrfToken = cookie.parse(document.cookie).bkom_csrftoken;
  if (csrfToken !== undefined) {
    axiosInstance.defaults.headers.common['X-CSRFToken'] = csrfToken;
  } else {
    console.warn('Can not find csrftoken in document.cookie');
  }
  return csrfToken;
}
