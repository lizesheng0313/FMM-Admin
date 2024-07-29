import request from '@utils/request';

export const fetchAdList = () => {
  return request({
    url: '/api/admin/ad/get',
    method: 'get',
  });
};

export const fetchAddAd = (data) => {
  return request({
    url: '/api/admin/ad/add',
    method: 'post',
    data,
  });
};

export const fetchUpdateAd = (data) => {
  return request({
    url: '/api/admin/ad/update',
    method: 'post',
    data,
  });
};

export const fetchDeleteAd = (data) => {
  return request({
    url: '/api/admin/ad/delete',
    method: 'post',
    data,
  });
};
