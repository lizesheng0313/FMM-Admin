import request from '@utils/request';

export const fetchLogin = (data: any) => {
  return request({
    url: '/cursor/user/login',
    method: 'post',
    data,
  });
};
