import newVue from "vue";
// import { default as request, getDesignerUrl } from "@wfruntime/util/request";
import request from "@/axios";
import { getDesignerUrl } from "@/axios";
import Qs from "qs";

export const propsCommon = {
  // 请求方式request
  requestMethod: {
    type: Function,
    default: request,
  },
  // Qs
  qsMethod: {
    type: Object,
    default: () => {
      return Qs;
    },
  },
  // Qs
  getDesignerUrl: {
    type: Function,
    default: getDesignerUrl,
  },
  process_this: {
    type: Object,
    default: () => {
      return process;
    },
  },
};
export const Vue = newVue;
export const setCss = function (templateCss) {
  // 动态插入css
  const css = templateCss;
  const head = document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
};
