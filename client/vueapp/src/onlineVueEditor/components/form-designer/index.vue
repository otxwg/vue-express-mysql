<template>
  <el-container class="main-container full-height">
    <el-header class="main-header">
      <div class="main-title">
        <span class="word"> {{ i18nt("application.productTitle") }}</span>
        <span>
          <a
            href="javascript:void(0)"
            style="position: relative"
            @click="showDocs"
          >
            <!-- <svg-icon icon-class="iconfont-erp iconyiwen" style="font-size: 16px; height: 50px" /> -->
            <!-- <img style="width: 14px; position: absolute; top: -11px; left: 8px" src="../../icons/svg/quetion.svg" alt="" /> -->
            <i class="iconfont-wfmng wfmng-bangzhu"></i>
          </a>
        </span>
      </div>
      <div class="external-link">
        <toolbar-panel :designer="designer" ref="toolbarRef" v-on="$listeners">
          <template #toolButton
            ><slot name="customToolButtons"></slot
          ></template>
        </toolbar-panel>
      </div>
    </el-header>

    <el-container class="main-warp">
      <el-aside class="side-panel">
        <widget-panel
          :form-module-list="formModuleList"
          v-bind="$attrs"
          v-on="$listeners"
          :designer="designer"
        />
      </el-aside>

      <el-container class="center-layout-container">
        <el-header class="toolbar-header">
          <Mode :designer="designer" ref="Mode" v-on="$listeners"></Mode>
        </el-header>
        <el-main id="el-form-widget-main" class="form-widget-main">
          <v-form-widget
            :designer="designer"
            :form-config="designer.formConfig"
            v-bind="$attrs"
            v-on="$listeners"
          >
          </v-form-widget>
        </el-main>
      </el-container>

      <el-aside class="right_el_side">
        <!-- {{ designer.selectedWidget }} -->
        <setting-panel
          :designer="designer"
          :selected-widget="designer.selectedWidget"
          :form-config="designer.formConfig"
          v-on="$listeners"
          v-bind="$attrs"
        />
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import WidgetPanel from "./widget-panel/index";
import ToolbarPanel from "./toolbar-panel/index";
import Mode from "./toolbar-panel/mode";
import SettingPanel from "./setting-panel/index";
import VFormWidget from "./form-widget/index";
import { createDesigner } from "./designer";
import { deepClone, getQueryParam } from "../../utils/util";
import { MOCK_CASE_URL, VARIANT_FORM_VERSION } from "../../utils/config";
import i18n, { changeLocale } from "../../utils/i18n";

export default {
  name: "VFormDesigner",
  componentName: "VFormDesigner",
  mixins: [i18n],
  components: {
    WidgetPanel,
    ToolbarPanel,
    SettingPanel,
    VFormWidget,
    Mode,
  },
  props: {
    /* 后端字段列表API */
    fieldListApi: {
      type: Object,
      default: null,
    },

    /* 禁止显示的组件名称数组 */
    bannedWidgets: {
      type: Array,
      default: () => [],
    },
    formModuleList: {
      type: Array,
      default: () => [],
    },
    designerConfig: {
      type: Object,
      default: () => {
        return {
          languageMenu: true, //是否显示语言切换菜单
          externalLink: true, //是否显示GitHub、文档等外部链接
          formTemplates: true, //是否显示表单模板
          eventCollapse: true, //是否显示组件事件属性折叠面板
          clearDesignerButton: true, //是否显示清空设计器按钮
          previewFormButton: true, //是否显示预览表单按钮
          importJsonButton: true, //是否显示导入JSON按钮
          exportJsonButton: true, //是否显示导出JSON器按钮
          exportCodeButton: true, //是否显示导出代码按钮
          generateSFCButton: true, //是否显示生成SFC按钮
        };
      },
    },
  },
  data() {
    return {
      vFormVersion: VARIANT_FORM_VERSION,
      curLangName: "",

      vsCodeFlag: false,
      caseName: "",

      designer: createDesigner(this),

      fieldList: [],
    };
  },
  provide() {
    return {
      serverFieldList: this.fieldList,
      getDesignerConfig: () => this.designerConfig,
      getBannedWidgets: () => this.bannedWidgets,
    };
  },
  created() {
    this.vsCodeFlag = getQueryParam("vscode") == 1;
    this.caseName = getQueryParam("case");
  },
  mounted() {
    this.initLocale();

    this.loadCase();

    this.loadFieldListFromServer();
  },
  methods: {
    showDocs() {
      this.$message.warning("暂无文档");
    },

    loadCase() {
      if (!this.caseName) {
        return;
      }

      axios
        .get(MOCK_CASE_URL + this.caseName + ".txt")
        .then((res) => {
          if (!!res.data.code) {
            this.$message.error(this.i18nt("designer.hint.sampleLoadedFail"));
            return;
          }

          this.setFormJson(res.data);
          this.$message.success(
            this.i18nt("designer.hint.sampleLoadedSuccess")
          );
        })
        .catch((error) => {
          this.$message.error(
            this.i18nt("designer.hint.sampleLoadedFail") + ":" + error
          );
        });
    },

    initLocale() {
      let curLocale = localStorage.getItem("v_form_locale");
      if (!!this.vsCodeFlag) {
        curLocale = curLocale || "en-US";
      } else {
        curLocale = curLocale || "zh-CN";
      }
      this.curLangName = this.i18nt("application." + curLocale);
      this.changeLanguage(curLocale);
    },

    loadFieldListFromServer() {
      if (!this.fieldListApi) {
        return;
      }

      axios
        .get(this.fieldListApi.URL)
        .then((res) => {
          let labelKey = this.fieldListApi.labelKey || "label";
          let nameKey = this.fieldListApi.nameKey || "name";

          res.data.forEach((fieldItem) => {
            this.fieldList.push({
              label: fieldItem[labelKey],
              name: fieldItem[nameKey],
            });
          });
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },

    handleLanguageChanged(command) {
      this.changeLanguage(command);
      this.curLangName = this.i18nt("application." + command);
    },

    changeLanguage(langName) {
      changeLocale(langName);
    },

    setFormJson(formJson) {
      let modifiedFlag = false;
      if (!!formJson) {
        if (typeof formJson === "string") {
          modifiedFlag = this.designer.loadFormJson(JSON.parse(formJson));
        } else if (formJson.constructor === Object) {
          modifiedFlag = this.designer.loadFormJson(formJson);
        }

        if (modifiedFlag) {
          this.designer.emitHistoryChange();
        }
      }
    },

    getFormJson() {
      return {
        widgetList: deepClone(this.designer.widgetList),
        formConfig: deepClone(this.designer.formConfig),
      };
    },

    clearDesigner() {
      this.$refs.toolbarRef.clearFormWidget();
    },

    /**
     * 刷新表单设计器
     */
    refreshDesigner() {
      //this.designer.loadFormJson( this.getFormJson() )  //只有第一次调用生效？？

      let fJson = this.getFormJson();
      this.designer.clearDesigner(true); //不触发历史记录变更
      this.designer.loadFormJson(fJson);
    },

    /**
     * 预览表单
     */
    previewForm() {
      this.$refs.toolbarRef.previewForm();
    },

    /**
     * 导入表单JSON
     */
    importJson() {
      this.$refs.toolbarRef.importJson();
    },

    /**
     * 导出表单JSON
     */
    exportJson() {
      this.$refs.toolbarRef.exportJson();
    },

    /**
     * 导出Vue/HTML代码
     */
    exportCode() {
      this.$refs.toolbarRef.exportCode();
    },

    /**
     * 生成SFC代码
     */
    generateSFC() {
      this.$refs.toolbarRef.generateSFC();
    },

    //TODO: 增加更多方法！！
  },
};
</script>

<style lang="scss" scoped>
.main-warp {
  height: calc(100% - 60px);
  background: #e4e7ed;
  padding: 16px;
}

.el-container.full-height {
  height: 100%;
  overflow-y: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
}

.el-container.center-layout-container {
  min-width: 680px;
  height: 100%;
  border-left: 2px dotted #ebeef5;
  border-right: 2px dotted #ebeef5;
  background: #e4e7ed;
  padding: 0 16px;
}

.el-header.main-header {
  display: flex;
  justify-content: space-between;
  // border-bottom: 2px dotted #ebeef5;
  height: 60px !important;
  line-height: 60px !important;
  min-width: 800px;
}

div.main-title {
  font-size: 14px;
  .word {
    font-size: 20px;
    font-weight: 550;
    color: #303133;
  }
  img {
    cursor: pointer;
    width: 36px;
    height: 36px;
  }

  span.bold {
    font-size: 20px;
    font-weight: bold;
    margin: 0 6px 0 6px;
  }

  span.version-span {
    font-size: 14px;
    color: #101f1c;
    margin-left: 6px;
  }
}

.el-dropdown-link {
  margin-right: 12px;
  cursor: pointer;
}

div.external-link a {
  font-size: 13px;
  text-decoration: none;
  margin-right: 10px;
  color: #606266;
}

.el-header.toolbar-header {
  font-size: 14px;
  border-bottom: 1px solid #d8dce6;
  height: 40px !important;
  background: #ecf5ff;
  //line-height: 42px !important;
}

.el-aside.side-panel {
  width: 320px !important;
  overflow: hidden;
  background: #fff;
}

.el-main.form-widget-main {
  padding: 0;
  position: relative;
  overflow-x: hidden;
  height: calc(100% - 40px);
  background: #fff;
}

.right_el_side {
  width: 360px !important;
  background: #fff;
  overflow: hidden;
  background: #fff;
}
</style>

<style lang="scss" scoped>
.form-widget-main {
  ::-webkit-scrollbar {
    display: none;
    width: 0;
  }
}
</style>
