import request from '@utils/request';

export const getAppIdList = () => {
  return request({
    url: '/api/admin/common/getAppIdList',
    method: 'get',
  });
};
