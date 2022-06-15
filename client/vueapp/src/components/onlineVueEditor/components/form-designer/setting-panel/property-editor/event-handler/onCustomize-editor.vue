<template>
  <div>
    <el-form-item label="onCustomize" label-width="150px">
      <el-button type="primary" icon="el-icon-plus" round @click="editEventHandler('onClick', eventParams)">添加流程策略</el-button>
    </el-form-item>
    <gd-dialog
      title="流程策略"
      class="small-padding-dialog"
      :z-index="2001"
      :closed.sync="showWidgetEventDialogFlag"
      :append-to-body="true"
      draggable
      :maximized.sync="maximized"
      width="600px"
      height="500px"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="触发时机">
          <el-select v-model="form.action" placeholder="请选择" size="medium">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="按钮操作">
          <el-select v-model="form.action1" placeholder="请选择操作" size="medium" clearable>
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>

        <template v-if="form.action1 === 'routerPath'">
          <el-divider>路由跳转</el-divider>
          <el-form-item label="跳转地址">
            <el-select v-model="form.action7" filterable allow-create default-first-option placeholder="请选择或输入跳转地址" size="medium" >
              <el-option v-for="item in options7" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路由传参">
            <el-select
              v-if="form.action1 === 'routerPath'"
              v-model="form.action8"
              filterable
              allow-create
              default-first-option
              placeholder="请选择或输入路由传参"
              size="medium"
    
            >
              <el-option v-for="item in options8" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="['searchData', 'resetSearch', 'tableSelectionAction', 'openDialog'].includes(form.action1)">
          <el-divider>选择组件标识</el-divider>
          <el-form-item :label="form.action1 === 'openDialog' ? '弹框标识' : '表格标识'">
            <el-select v-model="form.action9" filterable allow-create default-first-option size="medium" clearable>
              <el-option v-for="item in options9" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </template>

        <template v-if="['searchData', 'resetSearch', 'requestApi', 'tableSelectionAction'].includes(form.action1)">
          <el-divider>接口处理</el-divider>
          <template v-if="['searchData', 'resetSearch'].includes(form.action1)">
            <el-form-item label="返回字段">
              <el-select v-model="form.action6" filterable allow-create default-first-option placeholder="请选择或输入数据返回字段名称" size="medium">
                <el-option v-for="item in options6" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" size="medium" @click="showDialogMethod = true">接口数据处理</el-button>
            </el-form-item>
          </template>
        </template>
        <!-- 处理接口请求 -->
        <!-- 复选筛选表格数据字段 -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showWidgetEventDialogFlag = false"> {{ i18nt('designer.hint.cancel') }}</el-button>
        <el-button type="primary" @click="saveEventHandler"> {{ i18nt('designer.hint.confirm') }}</el-button>
      </div>
    </gd-dialog>
    <gd-dialog :title="'接口数据处理'" size="medium" :z-index="2002" :closed.sync="showDialogMethod" :append-to-body="true" draggable :maximized.sync="maximized" width="800px">
      <code-editor :mode="'javascript'" :readonly="false" v-model="configMethod" style="margin-top: 10px"></code-editor>
      <template slot="footer">
        <div>
          <el-button size="medium" @click="showDialogMethod = false">关闭</el-button>
        </div>
      </template>
    </gd-dialog>
  </div>
</template>

<script>
import i18n from '../../../../../utils/i18n'
import { genVueData } from '../../../../../utils/vue2js-generator'
import CodeEditor from '../../../../code-editor/index'
export default {
  name: 'onCustomize-editor',
  mixins: [i18n],
  components: { CodeEditor },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
    formConfig: Object
  },
  data() {
    return {
      configMethod: '',
      eventParams: [],
      options5: [],
      options7: [],
      options8: [],
      options9: [],
      options10: [],
      showDialogMethod: false,
      options: [
        {
          value: 'click',
          label: '单击'
        },
        {
          value: 'dblclick',
          label: '双击'
        }
      ],
      options6: [
        {
          value: 'data',
          label: 'data'
        },
        {
          value: 'data.records',
          label: 'data.records'
        }
      ],
      options4: [
        {
          value: 'get',
          label: 'GET'
        },
        {
          value: 'post',
          label: 'POST'
        }
      ],
      options3: [
        {
          value: 'current',
          label: 'current'
        },
        {
          value: 'size',
          label: 'size'
        }
      ],
      options1: [
        {
          value: 'searchData',
          label: '查询'
        },
        {
          value: 'justReset',
          label: '仅重置'
        },
        {
          value: 'resetSearch',
          label: '重置并查询'
        },
        {
          value: 'routerPath',
          label: '路由跳转'
        },
        {
          value: 'openDialog',
          label: '打开弹框'
        },
        {
          value: 'tableSelectionAction',
          label: '表格多选操作'
        },
        {
          value: 'requestApi',
          label: '请求接口、导出'
        }
      ],
      options2: [],
      form: {
        action: '',
        action1: '',
        action2: '',
        action3: '',
        action4: '',
        action5: '',
        action6: '',
        action7: '',
        action8: '',
        action9: '',
        action10: ''
      },
      showWidgetEventDialogFlag: false
    }
  },
  mounted() {
    const formData = genVueData(this.designer.formConfig, this.designer.widgetList)
    this.options2 = formData.map((res) => {
      const arr = res.split(':')
      return {
        value: arr[0],
        label: arr[0]
      }
    })
    this.form = this.optionModel.onCustomize !== '' ? JSON.parse(this.optionModel.onCustomize) : this.form
  },
  methods: {
    onChangeinput19114() {
      alert(22)
    },
    editEventHandler() {
      this.form = this.optionModel.onCustomize !== '' ? JSON.parse(this.optionModel.onCustomize) : {}
      this.showWidgetEventDialogFlag = true
    },
    saveEventHandler() {
      this.showWidgetEventDialogFlag = false
      this.$set(this.optionModel, 'onCustomize', JSON.stringify(this.form))
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-select {
  width: 100%;
}
/deep/.el-divider{
  margin: 16px 0!important;
}
</style>
