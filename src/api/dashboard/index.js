import request from '@utils/request';

export const fetchGetOrderCounts = () => {
  return request({
    url: '/api/admin/getOrderCounts',
    method: 'get',
  });
};

export const fetchGetCharts = () => {
  return request({
    url: '/api/admin/getCharts',
    method: 'get',
  });
};
