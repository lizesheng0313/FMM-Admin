import request from '@utils/request';

export const fetchAuthList = (params: any) => {
  return request({
    url: '/cursor/auth/list',
    method: 'get',
    params,
  });
};

export const createAuthCode = (data: any) => {
  return request({
    url: '/cursor/auth/create',
    method: 'post',
    data,
  });
};

export const updateAuthCode = (data: any) => {
  return request({
    url: '/cursor/auth/update',
    method: 'post',
    data,
  });
};

// 删除授权码
export function deleteAuthCode(id: number) {
  return request({
    url: `/cursor/auth/delete/${id}`,
    method: 'delete',
  });
}
