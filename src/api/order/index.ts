/*
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-05-06 14:50:08
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/api/order/index.ts
 */
import request from '../../utils/request'

export const fetchOrderList = (params: any) => {
  return request({
    url: '/api/admin/order/list',
    method: 'get',
    params,
  })
}

export const fetchShipGodos = (data: any) => {
  return request({
    url: '/api/admin/order/shipGoods',
    method: 'post',
    data,
  })
}

export const fetchReturnOrderList = (params: any) => {
  return request({
    url: '/api/admin/order/returnList',
    method: 'get',
    params,
  })
}

export const fetchAgreenOrder = (data: any) => {
  return request({
    url: '/api/admin/order/agreen',
    method: 'post',
    data,
  })
}

export const fetchRefuseOrder = (data: any) => {
  return request({
    url: '/api/admin/order/refuse',
    method: 'post',
    data,
  })
}

export const fetchRefundOrder = (data: any) => {
  return request({
    url: '/api/admin/order/approveRefund',
    method: 'post',
    data,
  })
}

export const fetchReceivedGoods = (data: any) => {
  return request({
    url: '/api/admin/order/receivedGoods',
    method: 'post',
    data,
  })
}

export const fetchGetLogList = () => {
  return request({
    url: '/api/admin/order/getExpressList',
    method: 'get',
  })
}
