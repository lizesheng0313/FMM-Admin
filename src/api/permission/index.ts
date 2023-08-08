
import request from '../../utils/request';

export const fetchMenu = () => {
    return request({
        url: '/api/admin/manage/get/menu',
        method: 'get'
    });
};

export const fetchConstant = () => {
    return request({
        url: '/api/admin/get/constant',
        method: 'get'
    });
};


export const fetchGetUserList = (params:any) => {
    return request({
        url: '/api/admin/getUserList',
        method: 'get',
        params
    });
};
