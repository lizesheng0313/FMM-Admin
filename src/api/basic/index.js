import request from '@utils/request';

export const fetchBasic = () => {
  return request({
    url: '/api/admin/basic/get',
    method: 'get',
  });
};

export const fetchAddBasic = (data) => {
  return request({
    url: '/api/admin/basic/add',
    method: 'post',
    data,
  });
};

export const fetchUpdateBasic = (data) => {
  return request({
    url: '/api/admin/basic/update',
    method: 'post',
    data,
  });
};
