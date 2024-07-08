import request from '@utils/request';

export const getAppIdList = (params) => {
  return request({
    url: '/api/admin/common/getAppIdList',
    method: 'get',
    params,
  });
};
