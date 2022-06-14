<template>
  <div>
    <el-form-item :label="'标题'">
      <el-input type="text" v-model="optionModel.dialogConfig.title"></el-input>
    </el-form-item>
    <el-form-item :label="'主题色'">
      <el-color-picker v-model="optionModel.dialogConfig.themeColor"></el-color-picker>
    </el-form-item>
    <el-form-item :label="'字体颜色'">
      <el-color-picker v-model="optionModel.dialogConfig.titleColor"></el-color-picker>
    </el-form-item>
    <el-form-item :label="'宽度'">
      <el-input type="text" v-model="optionModel.dialogConfig.width"></el-input>
    </el-form-item>
    <el-form-item :label="'高度'">
      <el-input type="text" v-model="optionModel.dialogConfig.height"></el-input>
    </el-form-item>
    <el-form-item label="遮罩层(预览有效)">
      <el-switch v-model="optionModel.dialogConfig.showModal" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
    </el-form-item>
    <el-form-item :label="'层级'">
      <el-input type="text" v-model="optionModel.dialogConfig.zIndex"></el-input>
    </el-form-item>
    <el-form-item label="显示底部">
      <el-switch v-model="optionModel.dialogConfig.isFooter" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
    </el-form-item>
    <el-form-item v-if="optionModel.dialogConfig.isFooter" label-width="0">
      <el-divider class="custom-divider-margin-top">底部按钮</el-divider>
      <div style="margin-bottom: 5px" v-for="(item, index) in optionModel.dialogConfig.btnFooterList" :key="index">
        <el-row :gutter="20">
          <el-col :span="10"><el-input type="text" v-model="item.name" placeholder="按钮名称"></el-input></el-col>
          <el-col :span="10">
            <el-select v-model="item.functionalStr" placeholder="请选择">
              <el-option v-for="el in item.functional" :key="el.value" :label="el.label" :value="el.value"> </el-option>
            </el-select>
          </el-col>
          <el-col :span="4" style="color: red; cursor: pointer"><span @click="deletOption(index)">删除</span></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" style="cursor: pointer; color: #409eff; text-align: center"><span @click="addHandler(index)">自定义功能</span></el-col>
        </el-row>
      </div>
      <el-button type="text" @click="addOption">增加按钮项</el-button>
    </el-form-item>
    <gd-dialog
      :title="i18nt('designer.setting.editFormEventHandler')"
      :closed.sync="showFormEventDialogFlag"
      class="small-padding-dialog"
      :maximized.sync="maximized"
      draggable
      maximizable
      :append-to-body="false"
    >
      <el-alert type="info" :closable="false" :title="'form.onCustomClickHandler {'"></el-alert>
      <code-editor :mode="'javascript'" :readonly="false" v-model="formEventHandlerCode"></code-editor>
      <el-alert type="info" :closable="false" title="}"></el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showFormEventDialogFlag = false"> {{ i18nt('designer.hint.cancel') }}</el-button>
        <el-button type="primary" @click="saveFormEventHandler"> {{ i18nt('designer.hint.confirm') }}</el-button>
      </div>
    </gd-dialog>
    <!-- <el-collapse v-model="activeNames">
      <el-collapse-item title="表格数据设置" name="1">
        <el-form-item :label="'表格列数据'">
          <el-button type="primary" size="small">添加表格列数据</el-button>
        </el-form-item>
        <el-form-item :label="'表格静态数据'">
          <el-button type="primary" size="small" @click="showDialogTable = true">添加表格数据</el-button>
        </el-form-item>
        <el-form-item :label="'使用静态数据'">
          <el-select v-model="optionModel.tableConfig.config2" placeholder="请选择">
            <el-option v-for="item in optionsStatic" :key="item.value" :label="item.label" :value="item.value">
              <span>{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-collapse-item>
    </el-collapse> -->
  </div>
</template>

<script>
import i18n from '../../../../../utils/i18n'
import CodeEditor from '../../../../code-editor/index'
export default {
  name: 'gdDialog-editor',
  components: { CodeEditor },
  mixins: [i18n],
  data() {
    return {
      currentButtonIndex: 0,
      showFormEventDialogFlag: false,
      activeNames: [],
      formEventHandlerCode: '',
      options6: [
        {
          value: 'data',
          label: 'data'
        },
        {
          value: 'data.records',
          label: 'data.records'
        }
      ]
    }
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  watch: {},
  methods: {
    saveFormEventHandler() {
      this.optionModel.dialogConfig.btnFooterList[this.currentButtonIndex].onCustomClickHandler = this.formEventHandlerCode
      this.showFormEventDialogFlag = false
    },
    addHandler(index) {
      this.currentButtonIndex = index
      const btn = this.optionModel.dialogConfig.btnFooterList[this.currentButtonIndex]
      if (!btn.id) {
        btn.id = this.uid()
      }
      this.formEventHandlerCode = this.optionModel.dialogConfig.btnFooterList[this.currentButtonIndex].onCustomClickHandler || ''
      this.showFormEventDialogFlag = true
    },
    addOption() {
      this.optionModel.dialogConfig.btnFooterList.push({
        name: '按钮名称',
        functionalStr: '',
        type: 'primary',
        id: this.uid(),
        functional: [{ label: '关闭弹框', value: 'closeDialog' }],
        onCustomClickHandler: '',
        method: '',
        config: {}
      })
    },
    deletOption(index) {
      this.optionModel.dialogConfig.btnFooterList.splice(index, 1)
    }
  }
}
</script>

<style scoped></style>
