/*
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-07 14:01:22
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/utils/request.ts
 */
import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import router from '../router';

const service: AxiosInstance = axios.create({
  timeout: 600000,
});

service.interceptors.request.use(
  (config: any) => {
    const token = sessionStorage.getItem('authorization');
    if (config && config.headers) {
      config.headers['authorization'] = token;
    }
    return config;
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('响应URL:', response?.config?.url);
    console.log('响应头:', response?.headers);
    console.log('完整响应:', response);

    if (response?.data?.code === 0) {
      if (response?.config?.url === '/cursor/user/login') {
        localStorage.setItem('authorization', response?.headers?.authorization || '');
        console.log('存储的token:', response?.headers?.authorization);
      }
      return response.data;
    } else {
      if (response?.data?.code === 2007 || response?.data?.code === 403) {
        router.replace('/login');
      }
      ElMessage.error(response?.data?.message || response?.data?.msg);
      return Promise.reject();
    }
  },
  (error: AxiosError) => {
    ElMessage.error(error?.message);
    return Promise.reject();
  }
);

export default service;
