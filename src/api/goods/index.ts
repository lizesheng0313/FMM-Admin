/*
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-02-26 22:18:32
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/api/goods/index.ts
 */
import request from '../../utils/request';

export const fetchGoodsList= () => {
    return request({
        url: '/api/manage/getGoods',
        method: 'get'
    });
};
export const fetchClassiFication= () => {
    return request({
        url: '/api/getClassiFication',
        method: 'get'
    });
};
export const fetchAddGoods= (data:any) => {
    return request({
        url: '/api/manage/addGoods',
        method: 'post',
        data
    });
};
export const fetchUpdateGoods= (data:any) => {
    return request({
        url: '/api/manage/updateGoods',
        method: 'post',
        data
    });
};