import Vue from "vue";
import SvgIcon from "./SvgIcon"; // svg component
// register globally
Vue.component("svg-icon", SvgIcon);

const req = require.context(".", true, /\.svg$/);
const requireAll = (requireContext) =>
  requireContext.keys().map(requireContext);
const svgNameList = requireAll(req)
  .map((module) => module.default)
  .map((svg) => {
    if (!svg && svg.id) {
      // 防止webpack没配置svg处理导致报错
      return svg;
    } else {
      return {
        ...svg,
        // name: svg.id.replace('icon-', '')
      };
    }
  });
export default svgNameList;
