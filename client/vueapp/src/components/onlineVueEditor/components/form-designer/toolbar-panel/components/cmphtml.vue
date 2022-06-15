<script>
import Vue from "vue";
// import { setCss, propsCommon } from '@wfruntime/components/WfExecutor/expand/inlineCode/inlineCommon/form.js'
import { setCss, propsCommon } from "../../../../utils/form";
import jquery from "../../../../utils/jquery.base64";
export default {
  name: "Cmphtml",
  inheritAttrs: false,
  // eslint-disable-next-line vue/require-prop-types,vue/no-dupe-keys
  props: {
    html: String,
    css: String,
    js: String,
    widget: Object,
    designer: Object,
  },
  render(h) {
    // console.log(jquery.base64.decode(this.css), 'css')
    // debugger
    if (jquery.base64.decode(this.html) !== "") {
      const jsData =
        this.js !== "" ? eval(`(${jquery.base64.decode(this.js)})`) : null;
      setCss(jquery.base64.decode(this.css));
      const com = Vue.extend({
        template: jquery.base64.decode(this.html),
        props: {
          widget: {
            type: Object,
            default: () => this.widget,
          },
          designer: {
            type: Object,
            default: () => this.designer,
          },
          ...propsCommon,
        },
        ...jsData,
      });
      return h(com, {});
    }
  },
};
</script>
