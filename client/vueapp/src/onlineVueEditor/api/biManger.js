// import request from '../../../../projects/erp/utils/axios'
const Qs = require("qs");
import Vue from "vue";
// import { default as request } from '@wfruntime/util/request'
import request from "../../axios";
const getBaseUrl = () => {
  return (
    Vue.prototype.setAgentApi("VUE_APP_DESIGNER_URL") + Vue.prototype.gdbpm
  );
  // return Vue.prototype.Vue.prototype.setAgentApi('VUE_APP_DESIGNER_URL')
};
// 获取字典
export const entitiesOfOneType = (params) => {
  return request({
    url:
      Vue.prototype.setAgentApi("VUE_APP_DESIGNER_URL") +
      "/sys-system" +
      "/dict/redis/entitiesOfOneType",
    method: "get",
    params: {
      ...params,
    },
  });
};
// 树
export function listAllRelById(data) {
  return request({
    url: getBaseUrl() + "/BiDbResource/listAllRelById",
    method: "post",
    data: Qs.stringify(data),
  });
}

export function createSql(data) {
  return request({
    url: getBaseUrl() + "/BiSearchdef/createSql",
    method: "post",
    data: Qs.stringify(data),
  });
}
// 生成预览sql
export function createPreviewSql(data) {
  return request({
    url: getBaseUrl() + "/BiSearchdef/createPreviewSql",
    method: "post",
    data: Qs.stringify(data),
  });
}

// 执行sql用于数据预览
export function executeSql(data) {
  return request({
    url: getBaseUrl() + "/BiSearchdef/executeSql",
    method: "post",
    data: Qs.stringify(data),
  });
}

// 根据实体属性分页查询
export function listByEntity(data) {
  return request({
    url: getBaseUrl() + "/BiSearchdef/listByBelongType",
    method: "post",
    data: Qs.stringify(data),
  });
}
// 根据实体属性分页查询
export function listByEntitySearch(data) {
  return request({
    url: getBaseUrl() + "/BiSearchDetail/listByEntity",
    method: "post",
    data: Qs.stringify(data),
  });
}
// 初始化查询
export function iniSearch(data) {
  return request({
    url: getBaseUrl() + "/BiSearchdef/iniSearch",
    method: "post",
    data: Qs.stringify(data),
  });
}
// 执行以保存的sql
export function executeBiQuery(data) {
  return request({
    url: getBaseUrl() + "/BiSearchdef/executeBiQuery",
    method: "post",
    data: Qs.stringify(data),
  });
}

// 查询目录树
export function attmlTabFileList(data = "ProTree") {
  return request({
    url: getBaseUrl() + `/Utils/getSubTypeTree?code=${data}`,
    method: "post",
    data: Qs.stringify(data),
  });
}

// 查询目录树(包含数据)
export function getTreeTypeAndSearchDef(data) {
  return request({
    url: getBaseUrl() + "/BiSearchdef/getTreeTypeAndSearchDef",
    method: "post",
    data: Qs.stringify(data),
  });
}

// 查询目录树根id
export function getTopLevelNode() {
  return request({
    url: Vue.prototype.gdbpm + "/BiDbResource/getTopLevelNode",
    method: "post",
  });
}

// 更新配置
export function updateSql(data) {
  return request({
    url: getBaseUrl() + "/BiSearchdef/updateSql",
    method: "post",
    data: Qs.stringify(data),
  });
}
// 删除配置
export function deleteConfug(data) {
  return request({
    url: getBaseUrl() + "/BiSearchdef/delete",
    method: "post",
    data: Qs.stringify(data),
  });
}
// 字典子项配置

export function deleteDictItemByCode(data) {
  return request({
    url: getBaseUrl() + "/SysDictType/deleteByCode",
    method: "post",
    data: Qs.stringify(data),
  });
}
// 导出excel
export function exportExcel(data) {
  return request({
    url: getBaseUrl() + "/BiSearchdef/exportExcel",
    method: "post",
    data: Qs.stringify(data),
    responseType: "blob",
  });
}

// 生成元数据
export function getBoEntInfo(data) {
  return request({
    url: getBaseUrl() + "/smform/bpmFormView/getBoEntInfo",
    method: "post",
    data: Qs.stringify(data),
  });
}
