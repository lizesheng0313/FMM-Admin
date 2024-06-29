/*
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-04 21:06:05
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/api/user/index.ts
 */
import request from '@utils/request';

export const fetchLogin = (data:any) => {
    return request({
        url: '/api/admin/user/login',
        method: 'post',
        data
    });
};

