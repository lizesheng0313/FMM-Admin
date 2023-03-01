/*
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-02-27 10:17:44
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/utils/request.ts
 */
import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';
import { ElMessage } from 'element-plus'

const service:AxiosInstance = axios.create({
    timeout: 5000
});

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response?.data?.code === 0) {
            return response.data
        } else {
            ElMessage.error(response?.data?.msg || 'Internal Server Error')
            return Promise.reject();
        }
    },
    (error: AxiosError) => {
        ElMessage.error(error?.response?.data?.message || 'Internal Server Error')
        return Promise.reject();
    }
);

export default service;
