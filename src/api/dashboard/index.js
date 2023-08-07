import request from "../../utils/request";

export const fetchGetOrderCounts = () => {
  return request({
    url: "/api/admin/getOrderCounts",
    method: "get",
  });
};
