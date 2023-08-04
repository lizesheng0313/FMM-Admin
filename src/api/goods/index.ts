/*
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-11 13:24:24
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/api/goods/index.ts
 */
import request from '../../utils/request'

export const fetchGoodsList = (params: any) => {
  return request({
    url: '/api/admin/manage/getGoods',
    method: 'get',
    params,
  })
}
export const fetchClassiFication = () => {
  return request({
    url: '/api/admin/getClassiFication',
    method: 'get',
  })
}
export const fetchAddGoods = (data: any) => {
  return request({
    url: '/api/admin/manage/addGoods',
    method: 'post',
    data,
  })
}
export const fetchUpdateGoods = (data: any) => {
  return request({
    url: '/api/admin/manage/updateGoods',
    method: 'post',
    data,
  })
}

export const fetchGoodsGetDetails = (params: any) => {
  return request({
    url: '/api/admin/manage/getDetails',
    method: 'get',
    params,
  })
}

export const fetchDeleteGoodsInfo = (data: any) => {
  return request({
    url: '/api/admin/manage/deleteGoods',
    method: 'post',
    data,
  })
}

export const fetchGetTargetInfo = (params: any) => {
  return request({
    url: '/api/admin/manage/getTargetInfo',
    method: 'get',
    params,
  })
}
