/*
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-02-26 12:24:53
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/api/permission/index.ts
 */
import request from '../../utils/request';

export const fetchMenu = () => {
    return request({
        url: '/api/admin/manage/get/menu',
        method: 'get'
    });
};

export const fetchConstant = () => {
    return request({
        url: '/api/admin/get/constant',
        method: 'get'
    });
};

