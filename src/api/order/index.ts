/*
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-06 09:56:39
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/api/order/index.ts
 */
import request from '../../utils/request';


export const fetchOrderList= (params:any) => {
    return request({
        url: '/api/order/list',
        method: 'get',
        params
    });
};

export const fetchDeleteGoodsInfo= (data:any) => {
    return request({
        url: '/api/manage/deleteGoods',
        method: 'post',
        data
    });
};

