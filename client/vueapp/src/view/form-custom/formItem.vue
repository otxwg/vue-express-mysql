<script>
import cmphtml from "./components/cmphtml.vue";
import { propsCommon, Vue } from "../../onlineVueEditor/utils/form";
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
export default {
  name: "Preview",
  // eslint-disable-next-line vue/require-prop-types
  props: ["itemData"],
  render(h) {
    // 设置样式
    const templeteData = this.itemData;
    const dataHtml = templeteData.html;
    const dataCss = "";
    const dataJs = eval(`(${templeteData.js})`);
    setCss(dataCss);
    // 引入插槽
    const slots = Object.keys(this.$slots)
      .reduce((arr, key) => arr.concat(this.$slots[key]), [])
      .map((vnode) => {
        vnode.context = this._self;
        return vnode;
      });
    if (dataHtml !== "" && dataJs) {
      const result = Vue.extend({
        components: { cmphtml },
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
</style>
