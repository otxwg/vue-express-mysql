<template>
  <static-content-wrapper
    :designer="designer"
    :field="field"
    :design-state="designState"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <div ref="fieldEditor">
      <cmphtml
        :html="elhtml"
        :css="elcss"
        :js="eljs"
        :widget="parentWidget"
        :designer="designer"
      ></cmphtml>
    </div>
  </static-content-wrapper>
</template>

<script>
import StaticContentWrapper from "./static-content-wrapper";
import emitter from "element-ui/lib/mixins/emitter";
import i18n, { translate } from "../../../../utils/i18n";
import fieldMixin from "./fieldMixin";
// import { setCss, propsCommon, Vue } from '@wfruntime/components/WfExecutor/expand/inlineCode/inlineCommon/form.js'
import { setCss, propsCommon, Vue } from "../../../../utils/form";
export default {
  name: "html-text-widget",
  componentName: "FieldWidget", //必须固定为FieldWidget，用于接收父级组件的broadcast事件
  mixins: [emitter, fieldMixin, i18n],
  props: {
    field: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,

    designState: {
      type: Boolean,
      default: false,
    },

    subFormRowIndex: {
      /* 子表单组件行索引，从0开始计数 */
      type: Number,
      default: -1,
    },
    subFormColIndex: {
      /* 子表单组件列索引，从0开始计数 */
      type: Number,
      default: -1,
    },
    subFormRowId: {
      /* 子表单组件行Id，唯一id且不可变 */
      type: String,
      default: "",
    },
  },
  watch: {
    "field.options.htmlContent": {
      handler(oldval, newval) {
        this.setCode(this.field.options.htmlContent);
      },
    },
  },
  data() {
    return {
      elhtml: "",
      elcss: "",
      eljs: "",
    };
  },
  mounted() {
    this.setCode(this.field.options.htmlContent);
    this.handleOnMounted();
  },

  beforeDestroy() {
    this.unregisterFromRefList();
  },

  methods: {
    setCode(val) {
      const l = Object.keys(val).length;
      if (l > 0) {
        this.elhtml = val.compView;
        this.elcss = val.compCss;
        this.eljs = val.compJavascript;
      } else {
        this.elhtml = "<div>自定义控件</div>";
        this.elcss = "";
        this.eljs = "";
      }
    },
  },
  components: {
    StaticContentWrapper,
    cmphtml: {
      props: {
        html: String,
        css: String,
        js: String,
        widget: Object,
        designer: Object,
      },
      render(h) {
        if (this.html !== "") {
          const jsData = this.js !== "" ? eval(`(${this.js})`) : null;
          setCss(this.css);
          const com = Vue.extend({
            template: this.html,
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
    },
  },
  computed: {},
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
    this.registerToRefList();
    this.initEventHandler();

    this.handleOnCreated();
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../styles/global.scss"; //* static-content-wrapper已引入，还需要重复引入吗？ *//
</style>
