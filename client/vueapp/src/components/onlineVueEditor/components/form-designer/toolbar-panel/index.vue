<template>
  <div class="toolbar-container">
    <div class="right-toolbar">
      <el-button
        size="small"
        class="right-toolbar-btn"
        @click="clearFormWidget"
      >
        <i class="el-icon-delete" />{{
          i18nt("designer.toolbar.clear")
        }}</el-button
      >
      <el-button size="small" class="right-toolbar-btn" @click="previewForm">
        <i
          style="font-size: 12px"
          class="iconfont-erp iconguanlian"
        />关联实体</el-button
      >
      <el-button size="small" class="right-toolbar-btn" @click="generateSFC">
        <svg-icon icon-class="code" icon-type="svg"></svg-icon>
        生成代码
      </el-button>
      <el-button
        size="small"
        class="right-toolbar-btn"
        type=""
        @click="saveFormModule"
      >
        <i class="iconfont-wfmng wfmng-baocun" style="font-size: 12px"></i
        >保存表单模板</el-button
      >
      <el-button size="small" class="right-toolbar-btn" type="" @click="setMenu"
        ><i class="iconfont-erp iconmobanguanli" style="font-size: 12px"></i
        >生成菜单</el-button
      >
      <el-button size="small" type="success" @click="previewForm">
        <i class="el-icon-view" />{{
          i18nt("designer.toolbar.preview")
        }}</el-button
      >
      <el-button size="small" type="primary" @click="generateSave"
        ><i class="iconfont-erp iconfabutijiao" style="font-size: 12px"></i>
        发布</el-button
      >
      <slot name="toolButton"></slot>
    </div>

    <gd-dialog
      :title="i18nt('designer.toolbar.preview')"
      :closed.sync="showPreviewDialogFlag"
      draggable
      maximizable
      :maximized.sync="maximized"
      v-if="showPreviewDialogFlag"
      class="small-padding-dialog"
      width="800px"
    >
      <div>
        <div
          class="form-render-wrapper"
          :class="[layoutType === 'H5' ? 'h5-layout' : '']"
        >
          <Test :item-data="itemData"></Test>
        </div>
      </div>
      <code-editor v-model="testFunc" style="display: none"></code-editor>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getFormData">{{
          i18nt("designer.hint.getFormData")
        }}</el-button>
        <el-button type="primary" @click="resetForm">{{
          i18nt("designer.hint.resetForm")
        }}</el-button>
        <el-button type="primary" @click="setFormDisabled">{{
          i18nt("designer.hint.disableForm")
        }}</el-button>
        <el-button type="primary" @click="setFormEnabled">{{
          i18nt("designer.hint.enableForm")
        }}</el-button>
        <el-button type="" @click="showPreviewDialogFlag = false">{{
          i18nt("designer.hint.closePreview")
        }}</el-button>
      </div>
    </gd-dialog>

    <gd-dialog
      :title="i18nt('designer.toolbar.importJson')"
      :closed.sync="showImportJsonDialogFlag"
      class="small-padding-dialog"
      :maximized.sync="maximized"
      draggable
      maximizable
      :append-to-body="false"
    >
      <el-alert
        type="info"
        :title="i18nt('designer.hint.importJsonHint')"
        show-icon
        class="alert-padding"
      ></el-alert>
      <code-editor
        :mode="'json'"
        :readonly="false"
        v-model="importTemplate"
      ></code-editor>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doJsonImport">
          {{ i18nt("designer.hint.import") }}</el-button
        >
        <el-button @click="showImportJsonDialogFlag = false">
          {{ i18nt("designer.hint.cancel") }}</el-button
        >
      </div>
    </gd-dialog>

    <gd-dialog
      :title="i18nt('designer.toolbar.exportJson')"
      :closed.sync="showExportJsonDialogFlag"
      class="small-padding-dialog"
      :maximized.sync="maximized"
      draggable
      maximizable
      :append-to-body="false"
    >
      <code-editor
        :mode="'json'"
        :readonly="true"
        v-model="jsonContent"
      ></code-editor>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="copy-json-btn"
          :data-clipboard-text="jsonRawContent"
          @click="copyFormJson"
        >
          {{ i18nt("designer.hint.copyJson") }}</el-button
        >
        <el-button @click="saveFormJson">{{
          i18nt("designer.hint.saveFormJson")
        }}</el-button>
        <el-button type="" @click="showExportJsonDialogFlag = false">
          {{ i18nt("designer.hint.closePreview") }}</el-button
        >
      </div>
    </gd-dialog>

    <gd-dialog
      :title="i18nt('designer.toolbar.exportCode')"
      :closed.sync="showExportCodeDialogFlag"
      class="small-padding-dialog"
      :maximized.sync="maximized"
      draggable
      maximizable
      :append-to-body="false"
    >
      <el-tabs
        type="border-card"
        class="no-box-shadow no-padding"
        v-model="activeCodeTab"
      >
        <el-tab-pane label="Vue" name="vue">
          <code-editor
            :mode="'html'"
            :readonly="true"
            v-model="vueCode"
            :user-worker="false"
          ></code-editor>
        </el-tab-pane>
        <el-tab-pane label="HTML" name="html">
          <code-editor
            :mode="'html'"
            :readonly="true"
            v-model="htmlCode"
            :user-worker="false"
          ></code-editor>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="copy-vue-btn"
          :data-clipboard-text="vueCode"
          @click="copyVueCode"
        >
          {{ i18nt("designer.hint.copyVueCode") }}</el-button
        >
        <el-button
          type="primary"
          class="copy-html-btn"
          :data-clipboard-text="htmlCode"
          @click="copyHtmlCode"
        >
          {{ i18nt("designer.hint.copyHtmlCode") }}</el-button
        >
        <el-button @click="saveVueCode">{{
          i18nt("designer.hint.saveVueCode")
        }}</el-button>
        <el-button @click="saveHtmlCode">{{
          i18nt("designer.hint.saveHtmlCode")
        }}</el-button>
        <el-button type="" @click="showExportCodeDialogFlag = false">
          {{ i18nt("designer.hint.closePreview") }}</el-button
        >
      </div>
    </gd-dialog>

    <gd-dialog
      :title="i18nt('designer.hint.exportFormData')"
      :closed.sync="showFormDataDialogFlag"
      class="small-padding-dialog"
      :maximized.sync="maximized"
      draggable
      maximizable
      :append-to-body="false"
    >
      <div style="border: 1px solid #dcdfe6">
        <code-editor
          :mode="'json'"
          :readonly="true"
          v-model="formDataJson"
        ></code-editor>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="copy-form-data-json-btn"
          :data-clipboard-text="formDataRawJson"
          @click="copyFormDataJson"
        >
          {{ i18nt("designer.hint.copyFormData") }}</el-button
        >
        <el-button @click="saveFormData">{{
          i18nt("designer.hint.saveFormData")
        }}</el-button>
        <el-button type="" @click="showFormDataDialogFlag = false">
          {{ i18nt("designer.hint.closePreview") }}</el-button
        >
      </div>
    </gd-dialog>

    <gd-dialog
      title="代码预览"
      :closed.sync="showExportSFCDialogFlag"
      v-if="showExportSFCDialogFlag"
      draggable
      maximizable
      :maximized.sync="maximized"
      :show-close="true"
      class="small-padding-dialog"
    >
      <code-editor
        :min-lines="500"
        :max-lines="1000"
        :mode="'html'"
        :readonly="true"
        v-model="sfcCode"
        :user-worker="false"
      ></code-editor>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="copy-vue2-sfc-btn"
          :data-clipboard-text="sfcCode"
          @click="copyV2SFC"
        >
          {{ i18nt("designer.hint.copyVue2SFC") }}</el-button
        >
        <el-button @click="saveV2SFC">{{
          i18nt("designer.hint.saveVue2SFC")
        }}</el-button>
        <el-button type="" @click="showExportSFCDialogFlag = false">
          {{ i18nt("designer.hint.closePreview") }}</el-button
        >
      </div>
    </gd-dialog>
  </div>
</template>

<script>
import VFormRender from "../../form-render/index";
import CodeEditor from "../../code-editor/index";
import Test from "./test.vue";
import Clipboard from "clipboard";
import {
  deepClone,
  copyToClipboard,
  generateId,
  getQueryParam,
  traverseAllWidgets,
} from "../../../utils/util";
import i18n from "../../../utils/i18n";
import { generateCode } from "../../../utils/code-generator";
import { genSFC } from "../../../utils/sfc-generator";
import loadBeautifier from "../../../utils/beautifierLoader";
import { saveAs } from "file-saver";

export default {
  name: "ToolbarPanel",
  mixins: [i18n],
  components: {
    VFormRender,
    CodeEditor,
    Test,
    Clipboard,
  },
  props: {
    designer: Object,
  },
  inject: ["getDesignerConfig"],
  data() {
    return {
      maximized: true,
      designerConfig: this.getDesignerConfig(),
      showPreviewDialogFlag: false,
      showImportJsonDialogFlag: false,
      showExportJsonDialogFlag: false,
      showExportCodeDialogFlag: false,
      showFormDataDialogFlag: false,
      showExportSFCDialogFlag: false,
      itemData: {},
      testFunc: "",
      importTemplate: "",
      jsonContent: "",
      jsonRawContent: "",
      formDataJson: "",
      formDataRawJson: "",
      vueCode: "",
      htmlCode: "",
      sfcCode: "",
      sfcCodeV3: "",
      activeCodeTab: "vue",
      activeSFCTab: "vue2",
    };
  },
  computed: {
    formJson() {
      return {
        widgetList: this.designer.widgetList,
        formConfig: this.designer.formConfig,
      };
    },
  },
  watch: {
    "designer.widgetList": {
      deep: true,
      handler(val) {
        // console.log('test-----', val)
        // this.refreshNodeTree()
      },
    },
  },
  methods: {
    baseInfoForm() {
      this.$emit("getBaseInfoForm", true);
    },
    // 保存
    generateSave() {
      loadBeautifier((beautifier) => {
        this.itemData = genSFC(
          this.designer.formConfig,
          this.designer.widgetList,
          beautifier,
          false,
          true
        );
        console.log(this.itemData, "this.sfcCode this.sfcCode ");
        const jsonData = this.exportJson(true);
        this.$emit(
          "templateData",
          this.designer.formConfig,
          this.designer.widgetList,
          this.designer,
          jsonData,
          this.itemData
        );
      });
    },
    // 保存表单模板
    saveFormModule() {
      const params = {
        formConfig: this.designer.formConfig,
        widgetList: this.designer.widgetList,
      };
      loadBeautifier((beautifier) => {
        this.itemData = genSFC(
          this.designer.formConfig,
          this.designer.widgetList,
          beautifier,
          false,
          true
        );
        this.$emit("getFormModule", params, this.itemData);
      });
    },
    setMenu() {
      const params = {
        formConfig: this.designer.formConfig,
        widgetList: this.designer.widgetList,
      };
      loadBeautifier((beautifier) => {
        this.itemData = genSFC(
          this.designer.formConfig,
          this.designer.widgetList,
          beautifier,
          false,
          true
        );
        this.$emit("setMenu", params, this.itemData);
      });
    },
    showToolButton(configName) {
      if (this.designerConfig[configName] === undefined) {
        return true;
      }

      return !!this.designerConfig[configName];
    },

    clearFormWidget() {
      this.designer.clearDesigner();
      localStorage.removeItem("moduleId");
    },

    previewForm() {
      loadBeautifier((beautifier) => {
        this.itemData = genSFC(
          this.designer.formConfig,
          this.designer.widgetList,
          beautifier,
          false,
          true
        );
        this.showPreviewDialogFlag = true;
      });
    },

    saveAsFile(fileContent, defaultFileName) {
      this.$prompt(
        this.i18nt("designer.hint.fileNameForSave"),
        this.i18nt("designer.hint.saveFileTitle"),
        {
          inputValue: defaultFileName,
          closeOnClickModal: false,
          inputPlaceholder: this.i18nt(
            "designer.hint.fileNameInputPlaceholder"
          ),
        }
      )
        .then(({ value }) => {
          if (!value) {
            value = defaultFileName;
          }

          if (getQueryParam("vscode") == 1) {
            this.vsSaveFile(value, fileContent);
            return;
          }

          const fileBlob = new Blob([fileContent], {
            type: "text/plain;charset=utf-8",
          });
          saveAs(fileBlob, value);
        })
        .catch(() => {
          //
        });
    },

    vsSaveFile(fileName, fileContent) {
      const msgObj = {
        cmd: "writeFile",
        data: {
          fileName,
          code: fileContent,
        },
      };
      window.parent.postMessage(msgObj, "*");
    },

    importJson() {
      this.importTemplate = JSON.stringify(
        this.designer.getImportTemplate(),
        null,
        "  "
      );
      this.showImportJsonDialogFlag = true;
    },

    doJsonImport() {
      try {
        const importObj = JSON.parse(this.importTemplate);
        this.designer.loadFormJson(importObj);

        this.showImportJsonDialogFlag = false;
        this.$message.success(this.i18nt("designer.hint.importJsonSuccess"));

        this.designer.emitHistoryChange();

        this.designer.emitEvent("form-json-imported", []);
      } catch (ex) {
        this.$message.error(ex + "");
      }
    },

    exportJson(type = false) {
      const widgetList = deepClone(this.designer.widgetList);
      const formConfig = deepClone(this.designer.formConfig);
      this.jsonContent = JSON.stringify({ widgetList, formConfig }, null, "  ");
      this.jsonRawContent = JSON.stringify({ widgetList, formConfig });
      if (type) {
        return this.jsonRawContent;
      }
      this.showExportJsonDialogFlag = true;
    },

    copyFormJson(e) {
      copyToClipboard(
        this.jsonRawContent,
        e,
        this.$message,
        this.i18nt("designer.hint.copyJsonSuccess"),
        this.i18nt("designer.hint.copyJsonFail")
      );
    },

    saveFormJson() {
      this.saveAsFile(this.jsonContent, `vform${generateId()}.json`);
    },

    exportCode() {
      this.vueCode = generateCode(this.formJson);
      this.htmlCode = generateCode(this.formJson, "html");
      this.showExportCodeDialogFlag = true;
    },

    copyVueCode(e) {
      copyToClipboard(
        this.vueCode,
        e,
        this.$message,
        this.i18nt("designer.hint.copyVueCodeSuccess"),
        this.i18nt("designer.hint.copyVueCodeFail")
      );
    },

    copyHtmlCode(e) {
      copyToClipboard(
        this.htmlCode,
        e,
        this.$message,
        this.i18nt("designer.hint.copyHtmlCodeSuccess"),
        this.i18nt("designer.hint.copyHtmlCodeFail")
      );
    },

    saveVueCode() {
      this.saveAsFile(this.vueCode, `vform${generateId()}.vue`);
    },

    saveHtmlCode() {
      this.saveAsFile(this.htmlCode, `vform${generateId()}.html`);
    },

    generateSFC() {
      loadBeautifier((beautifier) => {
        this.sfcCode = genSFC(
          this.designer.formConfig,
          this.designer.widgetList,
          beautifier
        );
        console.log(
          this.designer.formConfig,
          "this.designer.formConfigthis.designer.formConfig"
        );
        console.log(
          this.designer.widgetList,
          "this.designer.widgetListthis.designer.widgetList"
        );
        this.sfcCodeV3 = genSFC(
          this.designer.formConfig,
          this.designer.widgetList,
          beautifier,
          true
        );
        this.showExportSFCDialogFlag = true;
      });
    },

    copyV2SFC(e) {
      copyToClipboard(
        this.sfcCode,
        e,
        this.$message,
        this.i18nt("designer.hint.copySFCSuccess"),
        this.i18nt("designer.hint.copySFCFail")
      );
    },

    copyV3SFC(e) {
      copyToClipboard(
        this.sfcCodeV3,
        e,
        this.$message,
        this.i18nt("designer.hint.copySFCSuccess"),
        this.i18nt("designer.hint.copySFCFail")
      );
    },

    saveV2SFC() {
      this.saveAsFile(this.sfcCode, `vformV2-${generateId()}.vue`);
    },

    saveV3SFC() {
      this.saveAsFile(this.sfcCodeV3, `vformV3-${generateId()}.vue`);
    },

    getFormData() {
      this.$refs["preForm"]
        .getFormData()
        .then((formData) => {
          this.formDataJson = JSON.stringify(formData, null, "  ");
          this.formDataRawJson = JSON.stringify(formData);

          this.showFormDataDialogFlag = true;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },

    copyFormDataJson(e) {
      copyToClipboard(
        this.formDataRawJson,
        e,
        this.$message,
        this.i18nt("designer.hint.copyJsonSuccess"),
        this.i18nt("designer.hint.copyJsonFail")
      );
    },

    saveFormData() {
      this.saveAsFile(this.htmlCode, `formData${generateId()}.json`);
    },

    resetForm() {
      this.$refs["preForm"].resetForm();
    },

    setFormDisabled() {
      this.$refs["preForm"].disableForm();
    },

    setFormEnabled() {
      this.$refs["preForm"].enableForm();
    },

    handleFormChange(fieldName, newValue, oldValue, formModel) {
      /*
        console.log('---formChange start---')
        console.log('fieldName', fieldName)
        console.log('newValue', newValue)
        console.log('oldValue', oldValue)
        console.log('formModel', formModel)
        console.log('---formChange end---')
        */
    },

    testOnAppendButtonClick(clickedWidget) {
      console.log("test", clickedWidget);
    },

    testOnButtonClick(button) {
      console.log("test", button);
    },
  },
};
</script>

<style lang="scss" scoped>
div.toolbar-container {
}

.left-toolbar {
  float: left;
  margin-top: 5px;
  font-size: 16px;
}

.right-toolbar {
  float: right;

  ::v-deep .el-button--text {
    font-size: 14px !important;
  }
}

.el-button i {
  margin-right: 3px;
}

.small-padding-dialog {
  ::v-deep .el-dialog__header {
    //padding-top: 3px;
    //padding-bottom: 3px;
    background: #f1f2f3;
  }

  ::v-deep .el-dialog__body {
    padding: 12px 15px 12px 15px;

    .el-alert.alert-padding {
      padding: 0 10px;
    }
  }

  ::v-deep .ace-container {
    border: 1px solid #dcdfe6;
  }
}

.dialog-title-light-bg {
  ::v-deep .el-dialog__header {
    background: #f1f2f3;
  }
}

.no-box-shadow {
  box-shadow: none;
}

.no-padding.el-tabs--border-card {
  ::v-deep .el-tabs__content {
    padding: 0;
  }
}

.form-render-wrapper {
  //height: calc(100vh - 142px);
  all: revert !important; /* 防止表单继承el-dialog等外部样式，未生效，原因不明？？ */
}

.form-render-wrapper.h5-layout {
  margin: 0 auto;
  width: 420px;
  border-radius: 15px;
  //border-width: 10px;
  box-shadow: 0 0 1px 10px #495060;
  height: calc(100vh - 142px);
}

.node-tree-drawer ::v-deep {
  .el-drawer {
    padding: 15px;
    overflow: auto;
  }

  .el-drawer__header {
    margin-bottom: 12px;
    padding: 5px 5px 0;
  }
}

/*.node-tree-scroll-bar {*/
/*  height: 100%;*/
/*  overflow: auto;*/
/*}*/

.node-tree ::v-deep {
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node {
    position: relative;
    padding-left: 12px;
  }

  .el-tree-node__content {
    padding-left: 0 !important;
  }

  .el-tree-node__expand-icon.is-leaf {
    display: none;
  }
  .el-tree-node__children {
    padding-left: 12px;
  }

  .el-tree-node :last-child:before {
    height: 38px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 12px;
    width: 16px;
  }

  .el-tree-node.is-current > .el-tree-node__content {
    background: #c2d6ea !important;
  }

  .el-tree-node__expand-icon {
    margin-left: -3px;
    padding: 6px 6px 6px 0px;
    font-size: 16px;
  }

  .el-tree-node__expand-icon.el-icon-caret-right:before {
    //font-size: 16px;
    //content: "\e723";
  }

  .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    //font-size: 16px;
    //content: "\e722";
  }
}
.form-render-wrapper {
  /deep/.el-form-item {
    &__content {
      padding-right: 0px;
      margin-bottom: 0px;
    }
  }
}
.right-toolbar-btn {
  border: 1px solid #409eff;
  color: #409eff;
}
</style>
