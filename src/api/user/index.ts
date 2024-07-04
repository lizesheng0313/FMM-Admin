import request from '@utils/request';

export const fetchLogin = (data: any) => {
  return request({
    url: '/api/admin/user/login',
    method: 'post',
    data,
  });
};

export const fetchUserList = () => {
  return request({
    url: '/api/admin/user/get',
    method: 'get',
  });
};

export const fetchAddUser = (data: any) => {
  return request({
    url: '/api/admin/user/add',
    method: 'post',
    data,
  });
};

export const fetchUpdateUser = (data: any) => {
  return request({
    url: '/api/admin/user/update',
    method: 'post',
    data,
  });
};

export const fetchDeleteUser = (data: any) => {
  return request({
    url: '/api/admin/user/delete',
    method: 'post',
    data,
  });
};
