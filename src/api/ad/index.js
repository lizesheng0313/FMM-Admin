import request from "@utils/request";



export const fetchAdList = () => {
    return request({
        url: "/api/admin/fetchAdList",
        method: "get",
    });
};

export const fetchAddAd = (data) => {
    return request({
        url: "/api/admin/fetchAddAd",
        method: "post",
        data
    });
};

export const fetchUpdateAd = (data) => {
    return request({
        url: "/api/admin/fetchUpdateAd",
        method: "post",
        data
    });
};

export const fetchDeleteAd = (data) => {
    return request({
        url: "/api/admin/fetchDeleteAd",
        method: "post",
        data
    });
};