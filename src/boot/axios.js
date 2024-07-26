import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: '/' })

api.interceptors.request.use((config) => {
  return config;
},
  (err) => {
    return Promise.reject(err);
  }
)
api.interceptors.response.use((config) => {
  console.log(config)
  if (config.data.code != (200 || 0)) {
    //移除错误请求的缓存
    // instance.storage.remove(config.id);
    if (config.data.code == 404) {
      return {
        data: config.data,
        msg: '接口地址未找到',
      }
    }
    if (config.data.code == 401) {
      return {
        data: config.data,
        msg: '鉴权失败',
      }
    }

    return {
      data: config.data,
      msg: '服务器错误'
    }
  }
  return config.data;
},
  (err) => {
    return Promise.reject({
      mas: '未知错误',
      err
    });
  })

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
