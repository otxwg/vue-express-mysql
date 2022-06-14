<script>
import cmphtml from "./components/cmphtml.vue";
import { insertCustomCssToHead } from "../../../utils/util";
import { propsCommon, Vue } from "../../../utils/form.js";
function setCss(templateCss) {
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
}
// 过滤按钮，返回对象
// 判断数据可否被json.parse解析
function isJsonString(str) {
  try {
    if (typeof JSON.parse(str) === "object") {
      return true;
    }
  } catch (e) {
    // console.log(e)
  }
  return false;
}
export default {
  name: "Preview",
  // eslint-disable-next-line vue/require-prop-types
  props: ["itemData"],
  render(h) {
    // 设置样式
    const templeteData = this.itemData;
    const dataHtml = templeteData.html;
    // console.log(dataHtml, 'dataHtml')
    const dataCss = templeteData.globalCss;
    const dataJs = eval(`(${templeteData.js})`);
    const formCssCode = templeteData.descp;
    if (isJsonString(formCssCode)) {
      insertCustomCssToHead(JSON.parse(formCssCode).formConfig.cssCode);
    }
    setCss(dataCss);
    // 引入插槽
    const slots = Object.keys(this.$slots)
      .reduce((arr, key) => arr.concat(this.$slots[key]), [])
      .map((vnode) => {
        vnode.context = this._self;
        return vnode;
      });
    if (dataHtml !== "") {
      const result = Vue.extend({
        components: {
          cmphtml,
        },
        props: {
          ...propsCommon,
          itemData: {
            type: Object,
            default: () => {
              return this.itemData;
            },
          },
          rowData: {
            type: Object,
            default: () => {
              return this.rowData;
            },
          },
        },
        template: dataHtml,
        ...dataJs,
      });
      return h(result, {}, slots);
    }
  },
};
</script>
<style>
#inLineTable .el-form-item {
  margin-bottom: 0px;
}
.label-left-align .el-form-item__label {
  text-align: left;
}
.label-center-align .el-form-item__label {
  text-align: center;
}
.label-right-align .el-form-item__label {
  text-align: right;
}
</style>
