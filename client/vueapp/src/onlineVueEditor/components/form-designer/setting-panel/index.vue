<template>
  <el-container class="panel-container">
    <el-tabs :active-name="activeTab">
      <el-tab-pane :label="i18nt('designer.hint.widgetSetting')" name="1" class="my-el-tab-pane">
        <div class="setting-scrollbar">
          <!-- <template v-if="!!designer.selectedWidget && !designer.selectedWidget.category"> -->
          <el-form :model="optionModel" size="mini" label-position="left" label-width="120px" class="setting-form" @submit.native.prevent>
            <el-collapse v-model="widgetActiveCollapseNames" class="setting-collapse">
              <el-collapse-item name="1" v-if="showCollapse(commonProps)" :title="i18nt('designer.setting.commonSetting')">
                <template v-for="(editorName, propName) in commonProps">
                  <component
                    v-if="hasPropEditor(propName, editorName)"
                    :is="getPropEditor(propName, editorName)"
                    :designer="designer"
                    :selected-widget="selectedWidget"
                    :option-model="optionModel"
                    :form-config="formConfig"
                    :key="propName"
                  ></component>
                </template>
              </el-collapse-item>
              <el-collapse-item name="2" v-if="showCollapse(dataSettingProps)" :title="i18nt('designer.setting.dataSetting')">
                <template v-for="(editorName, propName) in dataSettingProps">
                  <component
                    v-if="hasPropEditor(propName, editorName)"
                    :is="getPropEditor(propName, editorName)"
                    :designer="designer"
                    :selected-widget="selectedWidget"
                    :option-model="optionModel"
                    :form-config="formConfig"
                    :key="propName"
                  ></component>
                </template>
              </el-collapse-item>
              <el-collapse-item name="3" v-if="showCollapse(wordTypeProps)" :title="i18nt('designer.setting.wordTypeSetting')">
                <template v-for="(editorName, propName) in wordTypeProps">
                  <component
                    v-if="hasPropEditor(propName, editorName)"
                    :is="getPropEditor(propName, editorName)"
                    :designer="designer"
                    :selected-widget="selectedWidget"
                    :option-model="optionModel"
                    :form-config="formConfig"
                    :key="propName"
                  ></component>
                </template>
              </el-collapse-item>

              <el-collapse-item name="4" v-if="showEventCollapse() && showCollapse(editAccessProps)" :title="i18nt('designer.setting.editAccessSetting')">
                <template v-for="(editorName, propName) in editAccessProps">
                  <component
                    v-if="hasPropEditor(propName, editorName)"
                    :is="getPropEditor(propName, editorName)"
                    :designer="designer"
                    :selected-widget="selectedWidget"
                    :option-model="optionModel"
                    :key="propName"
                    :form-config="formConfig"
                  ></component>
                </template>
              </el-collapse-item>

              <el-collapse-item name="5" v-if="showCollapse(styleSettingProps)" :title="i18nt('designer.setting.styleSetting')">
                <template v-for="(editorName, propName) in styleSettingProps">
                  <component
                    v-if="hasPropEditor(propName, editorName)"
                    :is="getPropEditor(propName, editorName)"
                    :designer="designer"
                    :selected-widget="selectedWidget"
                    :option-model="optionModel"
                    :key="propName"
                    :form-config="formConfig"
                  ></component>
                </template>
              </el-collapse-item>
              <el-collapse-item name="6" v-if="showEventCollapse() && showCollapse(eventProps)" :title="i18nt('designer.setting.eventSetting')">
                <template v-for="(editorName, propName) in eventProps">
                  <component
                    v-if="hasPropEditor(propName, editorName)"
                    :is="getPropEditor(propName, editorName)"
                    :designer="designer"
                    :selected-widget="selectedWidget"
                    :option-model="optionModel"
                    :key="propName"
                    :form-config="formConfig"
                  ></component>
                </template>
              </el-collapse-item>

              <el-collapse-item name="7" v-if="showCollapse(advProps)" :title="i18nt('designer.setting.advancedSetting')">
                <template v-for="(editorName, propName) in advProps">
                  <component
                    v-if="hasPropEditor(propName, editorName)"
                    :is="getPropEditor(propName, editorName)"
                    :designer="designer"
                    :selected-widget="selectedWidget"
                    :option-model="optionModel"
                    :key="propName"
                    :form-config="formConfig"
                  ></component>
                </template>
              </el-collapse-item>
              <el-collapse-item name="8" v-if="showEventCollapse() && showCollapse(otherSettingProps)" :title="i18nt('designer.setting.otherSetting')">
                <template v-for="(editorName, propName) in otherSettingProps">
                  <component
                    v-if="hasPropEditor(propName, editorName)"
                    :is="getPropEditor(propName, editorName)"
                    :designer="designer"
                    :selected-widget="selectedWidget"
                    :option-model="optionModel"
                    :key="propName"
                    :form-config="formConfig"
                  ></component>
                </template>
              </el-collapse-item>
            </el-collapse>
          </el-form>
          <!-- </template> -->

          <!-- <template v-if="!!designer.selectedWidget && !!designer.selectedWidget.category">
            <el-form :model="optionModel" size="mini" label-position="left" label-width="120px" class="setting-form" @submit.native.prevent>
              <el-collapse v-model="widgetActiveCollapseNames" class="setting-collapse">
                <el-collapse-item name="1" v-if="showCollapse(commonProps)" :title="i18nt('designer.setting.commonSetting')">
                  <template v-for="(editorName, propName) in commonProps">
                    <component
                      v-if="hasPropEditor(propName, editorName)"
                      :is="getPropEditor(propName, editorName)"
                      :designer="designer"
                      :selected-widget="selectedWidget"
                      :option-model="optionModel"
                      :key="propName"
                      :form-config="formConfig"
                    ></component>
                  </template>
                </el-collapse-item>

                <el-collapse-item name="2" v-if="showCollapse(advProps)" :title="i18nt('designer.setting.advancedSetting')">
                  <template v-for="(editorName, propName) in advProps">
                    <component
                      v-if="hasPropEditor(propName, editorName)"
                      :is="getPropEditor(propName, editorName)"
                      :designer="designer"
                      :selected-widget="selectedWidget"
                      :option-model="optionModel"
                      :key="propName"
                      :form-config="formConfig"
                    ></component>
                  </template>
                </el-collapse-item>

                <el-collapse-item name="3" v-if="showEventCollapse() && showCollapse(eventProps)" :title="i18nt('designer.setting.eventSetting')">
                  <template v-for="(editorName, propName) in eventProps">
                    <component
                      v-if="hasPropEditor(propName, editorName)"
                      :is="getPropEditor(propName, editorName)"
                      :designer="designer"
                      :selected-widget="selectedWidget"
                      :option-model="optionModel"
                      :key="propName"
                      :form-config="formConfig"
                    ></component>
                  </template>
                </el-collapse-item>
                <el-collapse-item name="4" v-if="showEventCollapse() && showCollapse(editAccessProps)" :title="i18nt('designer.setting.editAccessSetting')">
                  <template v-for="(editorName, propName) in editAccessProps">
                    <component
                      v-if="hasPropEditor(propName, editorName)"
                      :is="getPropEditor(propName, editorName)"
                      :designer="designer"
                      :selected-widget="selectedWidget"
                      :option-model="optionModel"
                      :key="propName"
                      :form-config="formConfig"
                    ></component>
                  </template>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </template> -->
        </div>
      </el-tab-pane>

      <el-tab-pane v-if="!!designer" :label="i18nt('designer.hint.formSetting')" name="2" class="my-el-tab-pane">
        <div class="setting-scrollbar">
          <form-setting :designer="designer" :form-config="formConfig"></form-setting>
        </div>
      </el-tab-pane>
    </el-tabs>

    <gd-dialog
      :title="i18nt('designer.setting.editWidgetEventHandler')"
      class="small-padding-dialog"
      :closed.sync="showWidgetEventDialogFlag"
      :append-to-body="true"
      draggable
      :maximized.sync="maximized"
    >
      <el-alert type="info" :closable="false" :title="eventHeader"></el-alert>
      <code-editor :mode="'javascript'" :readonly="false" v-model="eventHandlerCode"></code-editor>
      <el-alert type="info" :closable="false" title="}"></el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showWidgetEventDialogFlag = false"> {{ i18nt('designer.hint.cancel') }}</el-button>
        <el-button type="primary" @click="saveEventHandler"> {{ i18nt('designer.hint.confirm') }}</el-button>
      </div>
    </gd-dialog>
  </el-container>
</template>

<script>
import CodeEditor from '../../code-editor/index'
import PropertyEditors from './property-editor/index'
import FormSetting from './form-setting'
import WidgetProperties from './propertyRegister'
// import { addWindowResizeHandler } from '../../../utils/util'
import i18n from '../../../utils/i18n'

const {
  COMMON_PROPERTIES,
  ADVANCED_PROPERTIES,
  EVENT_PROPERTIES,
  EDIT_ACCESS_PROPERTIES,
  OTHERS_SETTING_PROPERTIES,
  DATA_SETTING_PROPERTIES,
  STYLE_PROPERTIES,
  WORD_TYPE_PROPERTIES
} = WidgetProperties
export default {
  name: 'SettingPanel',
  componentName: 'SettingPanel',
  mixins: [i18n],
  components: {
    CodeEditor,
    FormSetting,
    ...PropertyEditors
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    formConfig: Object
  },
  inject: ['getDesignerConfig'],
  data() {
    return {
      designerConfig: this.getDesignerConfig(),

      scrollerHeight: 0,

      activeTab: '2',
      widgetActiveCollapseNames: ['1', '3'], //['1', '2', '3'],
      formActiveCollapseNames: ['1', '2'],

      commonProps: COMMON_PROPERTIES,
      advProps: ADVANCED_PROPERTIES,
      eventProps: EVENT_PROPERTIES,
      editAccessProps: EDIT_ACCESS_PROPERTIES,
      otherSettingProps: OTHERS_SETTING_PROPERTIES,
      dataSettingProps: DATA_SETTING_PROPERTIES,
      styleSettingProps: STYLE_PROPERTIES,
      wordTypeProps: WORD_TYPE_PROPERTIES,
      showWidgetEventDialogFlag: false,
      eventHandlerCode: '',
      curEventName: '',
      eventHeader: '',

      subFormChildWidgetFlag: false
    }
  },
  computed: {
    optionModel: {
      get() {
        return this.selectedWidget.options
      },

      set(newValue) {
        this.selectedWidget.options = newValue
      }
    }
  },
  watch: {
    'designer.selectedWidget': {
      handler(val) {
        if (!!val) {
          this.activeTab = '1'
        }
      }
    },

    'selectedWidget.options': {
      //组件属性变动后，立即保存表单JSON！！
      deep: true,
      handler() {
        this.designer.saveCurrentHistoryStep()
      }
    },

    formConfig: {
      deep: true,
      handler() {
        this.designer.saveCurrentHistoryStep()
      }
    }
  },
  created() {
    console.log(DATA_SETTING_PROPERTIES, 'DATA_SETTING_PROPERTIES')
    this.$on('editEventHandler', function (eventName, eventParams) {
      this.editEventHandler(eventName, eventParams)
    })

    this.designer.handleEvent('form-css-updated', (cssClassList) => {
      this.designer.setCssClassList(cssClassList)
    })
  },
  mounted() {
    if (!this.designer.selectedWidget) {
      this.activeTab = '2'
    } else {
      this.activeTab = '1'
    }
  },
  methods: {
    showEventCollapse() {
      if (this.designerConfig['eventCollapse'] === undefined) {
        return true
      }

      return !!this.designerConfig['eventCollapse']
    },

    hasPropEditor(propName, editorName) {
      if (!editorName) {
        return false
      }
      let originalPropName = propName.replace(this.selectedWidget.type + '-', '') //去掉组件名称前缀-，如果有的话！！
      return this.designer.hasConfig(this.selectedWidget, originalPropName)
    },

    getPropEditor(propName, editorName) {
      // debugger
      let originalPropName = propName.replace(this.selectedWidget.type + '-', '') //去掉组件名称前缀-，如果有的话！！
      let ownPropEditorName = `${this.selectedWidget.type}-${originalPropName}-editor`
      //console.log(ownPropEditorName, this.$options.components[ownPropEditorName])
      if (!!this.$options.components[ownPropEditorName]) {
        //局部注册的属性编辑器组件
        return ownPropEditorName
      }

      return !!this.$root.$options.components[ownPropEditorName] ? ownPropEditorName : editorName //全局注册的属性编辑器组件
    },

    showCollapse(propsObj) {
      let result = false

      for (let propName in propsObj) {
        if (!propsObj.hasOwnProperty(propName)) {
          continue
        }

        if (this.hasPropEditor(propName, propsObj[propName])) {
          result = true
          break
        }
      }

      return result
    },

    editEventHandler(eventName, eventParams) {
      this.curEventName = eventName
      this.eventHeader = `${this.optionModel.name}.${eventName}(${eventParams.join(', ')}) {`
      this.eventHandlerCode = this.selectedWidget.options[eventName] || ''

      // 设置字段校验函数示例代码
      if (eventName === 'onValidate' && !this.optionModel['onValidate']) {
        this.eventHandlerCode =
          "  /* sample code */\n  /*\n  if ((value > 100) || (value < 0)) {\n    callback(new Error('error message'))  //fail\n  } else {\n    callback();  //pass\n  }\n  */"
      }

      this.showWidgetEventDialogFlag = true
    },

    saveEventHandler() {
      this.selectedWidget.options[this.curEventName] = this.eventHandlerCode
      this.showWidgetEventDialogFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-container {
  height: 100%;
  width: 100%;
  /deep/.el-tabs {
    height: 100%;
    width: 100%;
  }
  /deep/ .el-tabs__content {
    height: calc(100% - 40px);
  }
  /deep/ .el-tabs__header {
    margin: 0;
    padding: 0;
  }
  /deep/.el-tabs__header {
    margin: 0;
    padding: 0;
    height: 40px;
    margin-bottom: 0;
    background: #fff;
    border: none;
    // padding: 0 16px;
    position: relative;
    margin: 0;
    padding-top: 4px;
    box-sizing: border-box;
    .el-tabs__nav {
      height: 36px;
    }
    .el-tabs__nav-wrap {
      padding: 0 16px;
      &::after {
        height: 1px;
      }
    }
    .el-tabs__item {
      font-weight: 600 !important;
      color: #303133 !important;
      margin-right: 4px;
      border: 1px solid #e4e7ed;
      box-sizing: border-box;
      text-align: center;
      padding-left: 0;
      height: 36px;
      line-height: 36px;
      background: #f2f6fc;
      border-radius: 6px 6px 0px 0px;
      width: 107px;
      padding: 0;
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item.is-active {
      background: #409eff;
      border-color: #409eff;
      color: #fff !important;
      text-align: center;
      padding-left: 0;
    }
  }
  /deep/ .el-collapse-item__header {
    font-weight: 550;
    position: relative;
    padding-left: 10px;

    &::before {
      position: absolute;
      content: '';
      width: 3px;
      height: 16px;
      background: #409eff;
      border-radius: 2px;
      left: 0px;
    }
  }

  /deep/ .el-form-item {
    margin-bottom: 10px;
  }

  .my-el-tab-pane {
    height: 100%;
    .setting-scrollbar {
      height: 100%;
      overflow: auto;
      padding: 0 16px;
      box-sizing: border-box;
      border: none;
      .setting-collapse {
        border: none;
        .last-el-collapse-item {
          /deep/ .el-collapse {
            border-top: none;
          }
          /deep/ .el-collapse-item__wrap {
            border-bottom: none !important;
          }
        }
      }
    }
  }
}
// /deep/ .el-collapse-item__content {
//     margin-bottom: 2px !important;
//   }
/deep/ .el-collapse-item__content {
  padding-bottom: 10px !important;
}
</style>
<style lang="scss" scoped>
.my-el-tab-pane {
  ::-webkit-scrollbar {
    display: none;
    width: 0;
  }
}
</style>
