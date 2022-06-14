import request from "../axios";
// 查询
export const getList = (params) => {
  return request({
    url: "/article/query",
    method: "get",
    params,
  });
};
//  新增
export const addList = (data) => {
  return request({
    url: "/article/insert",
    method: "post",
    data,
  });
};

//  修改
export const updateList = (data) => {
  return request({
    url: "/article/update",
    method: "post",
    data,
  });
};

//  删除
export const removeList = (data) => {
  return request({
    url: "/article/remote",
    method: "post",
    data,
  });
};

// 查询
export const getDesignerList = (params) => {
  return request({
    url: "/smform/query",
    method: "get",
    params,
  });
};
//  新增
export const addDesignerList = (data) => {
  return request({
    url: "/smform/insert",
    method: "post",
    data,
  });
};

//  修改
export const updateDesignerList = (data) => {
  return request({
    url: "/smform/update",
    method: "post",
    data,
  });
};

//  删除
export const removeDesignerList = (data) => {
  return request({
    url: "/smform/remote",
    method: "post",
    data,
  });
};
