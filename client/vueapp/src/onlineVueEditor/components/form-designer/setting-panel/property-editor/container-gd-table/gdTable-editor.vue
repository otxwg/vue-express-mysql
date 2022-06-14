<template>
  <div>
    <TableConfig ref="tableConfig" :optionModel="optionModel"></TableConfig>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="表格数据设置" name="1">
        <el-form-item :label="'表格列数据'">
          <el-button type="primary" size="small" @click="dialogMethod">添加表格列数据</el-button>
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
      <el-collapse-item title="接口数据处理" name="2">
        <el-form-item :label="'接口地址'">
          <el-input type="text" v-model="optionModel.tableConfig.url"></el-input>
        </el-form-item>

        <el-form-item :label="'请求方式'">
          <el-select v-model="optionModel.tableConfig.method" placeholder="请选择">
            <el-option v-for="item in optionsMethod" :key="item.value" :label="item.label" :value="item.value">
              <span>{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0">
          <el-divider class="custom-divider-margin-top">接口请求参数</el-divider>
          <div style="margin-bottom: 5px" v-for="(item, index) in optionModel.tableSearchData" :key="index">
            <el-row :gutter="20">
              <el-col :span="10"><el-input type="text" v-model="item.label" placeholder="字段名"></el-input></el-col>
              <el-col :span="10"><el-input type="text" v-model="item.value" placeholder="字段值"></el-input></el-col>
              <el-col :span="4" style="color: red; cursor: pointer"><span @click="deleteOption(index)">删除</span></el-col>
            </el-row>
          </div>
          <el-button type="text" @click="addOption">增加查询项</el-button>
        </el-form-item>
        <el-form-item label="返回字段：" label-width="80px">
          <el-select v-model="optionModel.tableConfig.config5" filterable allow-create default-first-option clearable placeholder="请选择或输入数据返回字段名称" size="small">
            <el-option v-for="item in options6" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否分页：" label-width="80px">
          <el-switch v-model="optionModel.otherConfig.isPage"></el-switch>
        </el-form-item>
        <el-form-item label-width="0">
          <el-divider class="custom-divider-margin-top">分页参数</el-divider>
          <div style="margin-bottom: 5px">
            <el-row :gutter="20"> 
              <el-col :span="12"><el-input type="text" v-model="optionModel.otherConfig.currentName" placeholder="分页页码字段名"></el-input></el-col>
              <el-col :span="12"><el-input type="text" v-model="optionModel.otherConfig.currentValue" placeholder="分页页码字段值"></el-input></el-col>
            </el-row>
          </div>
          <div style="margin-bottom: 5px">
            <el-row :gutter="20">
              <el-col :span="12"><el-input type="text" v-model="optionModel.otherConfig.sizeName" placeholder="每页条数字段名"></el-input></el-col>
              <el-col :span="12"><el-input type="text" v-model="optionModel.otherConfig.sizeValue" placeholder="每页条数字段值"></el-input></el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item v-if="optionModel.otherConfig.isPage" label="总数字段：" label-width="80px">
          <el-select v-model="optionModel.otherConfig.totalName" filterable allow-create default-first-option clearable placeholder="请选择或输入总数对应字段" size="small">
            <el-option v-for="item in options8" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="''">
          <el-button type="primary" size="small" @click="showDialogMethod = true">接口数据处理</el-button>
        </el-form-item>
      </el-collapse-item>
    </el-collapse>

    <AddColumn ref="addColumn" v-model="optionModel.tableColumn"></AddColumn>

    <gd-dialog :title="'添加表格数据'" size="small" :z-index="2001" :closed.sync="showDialogTable" :append-to-body="true" draggable :maximized.sync="maximized" width="800px">
      <code-editor :mode="'javascript'" :readonly="false" v-model="optionModel.tableData" style="margin-top: 10px"></code-editor>
      <template slot="footer">
        <div>
          <el-button size="small" @click="showDialogTable = false">关闭</el-button>
        </div>
      </template>
    </gd-dialog>
    <gd-dialog :title="'接口数据处理'" size="small" :z-index="2001" :closed.sync="showDialogMethod" :append-to-body="true" draggable :maximized.sync="maximized" width="800px">
      <code-editor :mode="'javascript'" :readonly="false" v-model="optionModel.tableConfig.configMethod" style="margin-top: 10px"></code-editor>
      <template slot="footer">
        <div>
          <el-button size="small" @click="showDialogMethod = false">关闭</el-button>
        </div>
      </template>
    </gd-dialog>
  </div>
</template>

<script>
import i18n from '../../../../../utils/i18n'
import CodeEditor from '../../../../code-editor/index'
import AddColumn from './add-column.vue'
import TableConfig from './table-config.vue'
export default {
  name: 'gdTable-editor',
  components: { CodeEditor, AddColumn, TableConfig },
  mixins: [i18n],
  data() {
    return {
      activeNames: [],
      visibleDraw: false,
      maximized: false,
      showDialog: false,
      showDialogMethod: false,
      showDialogTable: false,
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
      options8: [
        {
          value: 'total',
          label: 'total'
        }
      ],
      optionsStatic: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      optionsMethod: [
        {
          value: 'post',
          label: 'post'
        },
        {
          value: 'get',
          label: 'get'
        }
      ]
    }
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  watch: {
    'optionModel.tableColumn': {
      deep: true,
      handler(val) {
        if (val.length > 0) {
          this.$refs.addColumn.tableList = val
        }
      }
    }
  },
  methods: {
    addOption() {
      this.optionModel.tableSearchData.push({ value: '', label: '' })
    },
    deleteOption(index) {
      this.optionModel.tableSearchData.splice(index, 1)
    },
    dialogMethod() {
      this.$refs.addColumn.showDialog = true
    },
    onSubmit() {}
  }
}
</script>

<style scoped></style>
