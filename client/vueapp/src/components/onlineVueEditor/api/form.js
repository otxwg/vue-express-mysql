const Qs = require("qs");
import Vue from "vue";
// import { default as request } from '@wfruntime/util/request'
import request from "@/axios";
const getBaseUrl = () => {
  return Vue.prototype.setAgentApi("VUE_APP_DESIGNER_URL");
  // return Vue.prototype.Vue.prototype.setAgentApi('VUE_APP_DESIGNER_URL')
};
// 获取字典类型树
export function getSubTypeTree(params) {
  return request({
    url: getBaseUrl() + `/sys-system/DictType/redis/typeTree`,
    method: "post",
    params: params,
  });
}
export function listUnitAndUser(data) {
  return request({
    url: getBaseUrl() + "/sys-system/dept/findByDeptIdSonDeptAndUser?deptIds=0",
    method: "post",
    data: Qs.stringify(data),
  });
}
export function listRoleTree(data) {
  return request({
    url: getBaseUrl() + "/sys-system/role/tree",
    method: "get",
    // data: Qs.stringify(data)
  });
}
export function getFindAllDefWithNode(data) {
  return request({
    url: getBaseUrl() + `/gdbpm/bpm/core/bpmDef/findAllDefWithNode`,
    method: "get",
    params: data,
  });
}
export const getList = (params) => {
  return request({
    url: getBaseUrl() + "/sys-system/post/list",
    method: "get",
    params: params,
  });
};
