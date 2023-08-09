import request from "../../utils/request";

export const fetchGetClassiFication = () => {
  return request({
    url: "/api/admin/getClassiFication",
    method: "get",
  });
};

export const fetchAddCategory = (data) => {
  return request({
    url: "/api/admin/category/add",
    method: "post",
    data,
  });
};

export const fetchEditCategory = (data) => {
  return request({
    url: "/api/admin/category/edit",
    method: "post",
    data,
  });
};

export const fetchDelCategory = (data) => {
  return request({
    url: "/api/admin/category/delete",
    method: "post",
    data,
  });
};
