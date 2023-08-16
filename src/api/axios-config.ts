// 配置axios
// @author Huayu
// @date 2023-08-14 22:52

import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const request = axios.create({
  // `timeout` 指定请求超时的毫秒数
  // 如果请求时间超过`timeout`的值, 则请求会被中断, 默认值为 `0` (永不超时)
  timeout: 10000,
  baseURL: 'http://localhost:6870'
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.request.use(
  response => {
    // 2xx 范围内的状态码都会触发该函数
    // 对响应数据做点什么
    return response
  },
  error => {
    // 超出 2xx 范围的状态码都会触发该函数
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export const IRequest = {
  request<T>(config: AxiosRequestConfig): Promise<IResponse<T>> {
    return new Promise((resolve, reject) => {
      request(config)
        .then(resp => {
          resolve(resp.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  get<T>(url: string, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    return this.request({
      ...config,
      url,
      method: 'GET'
    })
  },

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    return this.request({
      ...config,
      url,
      data,
      method: 'POST'
    })
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    return this.request({
      ...config,
      url,
      method: 'DELETE'
    })
  },

  put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    return this.request({
      ...config,
      url,
      data,
      method: 'PUT'
    })
  }
}

export default request
