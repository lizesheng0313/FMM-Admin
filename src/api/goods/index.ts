
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
