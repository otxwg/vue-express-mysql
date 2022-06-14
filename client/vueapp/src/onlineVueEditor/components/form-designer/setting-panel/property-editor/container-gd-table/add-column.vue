<template>
  <div class="add_col_clss">
    <gd-dialog
      :title="'添加表格列数据'"
      size="small"
      :z-index="1200"
      :closed.sync="showDialog"
      :append-to-body="true"
      draggable
      :maximized.sync="maximized"
      width="1200px"
      height="655px"
    >
      <div style="text-align: right; margin-bottom: 5px">
        <el-checkbox v-model="psColumn.index" @change="onClickColumn('index', $event)">序号列</el-checkbox>
        <el-checkbox v-model="psColumn.selection" @change="onClickColumn('selection', $event)">选择列</el-checkbox>
        <el-checkbox v-model="psColumn.expand" @change="onClickColumn('expand', $event)" style="margin-right: 20px">展开行</el-checkbox>
        <el-button type="primary" plain size="mini" @click="addCol">添加</el-button>
        <el-button type="primary" size="mini" @click="addData">导入数据</el-button>
      </div>
      <gd-table ref="gdtable" :columns="newTableColumn" :bottom-offset="200" :data="tableList" border row-sortable @on-row-sort="onRowSort">
        <template slot="label" slot-scope="scope">
          <el-input v-model="scope.row.label" placeholder="请输入字段名称" size="small" />
        </template>
        <template slot="prop" slot-scope="scope">
          <el-input :rows="2" v-model="scope.row.prop" type="text" :disabled="disableProp(scope.row)" placeholder="请输入字段" size="small" />
        </template>
        <template slot="length" slot-scope="scope">
          <el-input :rows="2" v-model="scope.row.length" type="text" placeholder="请输入长度" size="small" />
        </template>
        <!--        <template slot="type" slot-scope="scope">
          <el-select v-model="scope.row.type" size="small" clearable="">
            <el-option v-for="(item, index) in ['selection', 'index', 'expand']" :key="index" :label="item" :value="item" />
          </el-select>
        </template>-->
        <template slot="width" slot-scope="scope">
          <el-input :rows="2" v-model="scope.row.width" type="text" placeholder="请输入宽度" size="small" />
        </template>
        <template slot="align" slot-scope="scope">
          <el-select v-model="scope.row.align" class="el-width-p100" size="small">
            <el-option v-for="(item, index) in ['center', 'left', 'right']" :key="index" :label="item" :value="item" />
          </el-select>
        </template>
        <template slot="resizable" slot-scope="scope">
          <el-switch v-model="scope.row.resizable" />
        </template>
        <template slot="fixed" slot-scope="scope">
          <el-switch v-model="scope.row.fixed" />
        </template>

        <template slot="summary" slot-scope="scope">
          <el-switch v-model="scope.row.summary" />
        </template>

        <template slot="caozuo" slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="delTable(scope.row)">删除</el-button>
          <el-button type="primary" plain size="mini" @click="codeEdit(scope.row, scope.$index)">代码编辑</el-button>
        </template>
      </gd-table>

      <template slot="footer">
        <div>
          <el-button size="small" type="primary" @click="submit">确定</el-button>
          <el-button size="small" @click="showDialog = false">关闭</el-button>
        </div>
      </template>
    </gd-dialog>
    <gd-dialog
      :title="'导入列数据'"
      size="small"
      :z-index="2001"
      :closed.sync="showImportDialog"
      :append-to-body="true"
      draggable
      :maximized.sync="maximized"
      width="1000px"
      height="600px"
    >
      <code-editor :mode="'javascript'" :readonly="false" v-model="importData" style="margin-top: 10px"></code-editor>
      <template slot="footer">
        <div>
          <el-button size="small" type="primary" @click="submitImportData">确定</el-button>
          <el-button size="small" @click="showImportDialog = false">关闭</el-button>
        </div>
      </template>
    </gd-dialog>
    <BtnDrawer ref="btnDrawer" :generate-conf="generateConf" size="100%" @saveCodeData="saveCodeData" @closedPreview="closedPreview" />
  </div>
</template>

<script>
import i18n from '../../../../../utils/i18n'
import CodeEditor from '../../../../code-editor/index'
import pseudoColumn from './pseudoColumn'
const BtnDrawer = () => import('gd_vue_components/src/components_others/gd_form_design/src/views/index/BtnDrawer')
export default {
  name: 'add-column',
  components: { BtnDrawer, CodeEditor },
  mixins: [i18n],
  data() {
    return {
      tableList: [],
      importData: '',
      tablePseudoColumn: {
        ...pseudoColumn
      },
      psColumn: {
        index: false,
        selection: false,
        expand: false
      },
      psColumnList: ['selection', 'index', 'expand'],
      tableStart: {
        tId: 0,
        label: '',
        prop: '',
        type: '',
        resizable: true,
        width: '',
        fixed: false,
        summary: false,
        align: 'center'
      },
      newTableColumn: [
        {
          label: '字段名称',
          prop: 'label',
          align: 'center'
        },
        {
          label: '字段',
          prop: 'prop',
          align: 'center'
        },
        {
          label: '宽度',
          prop: 'width',
          align: 'center'
        },
        // {
        //   label: '类型',
        //   prop: 'type',
        //   align: 'center'
        // },
        {
          label: '对齐',
          prop: 'align',
          align: 'center'
        },
        {
          label: '拖动',
          prop: 'resizable',
          align: 'center',
          width: '80px'
        },
        {
          label: '固定',
          prop: 'fixed',
          align: 'center',
          width: '80px'
        },
        {
          label: '在线代码',
          prop: 'summary',
          align: 'center',
          width: '80px'
        },
        {
          label: '操作',
          prop: 'caozuo',
          align: 'center',
          width: '200px'
        }
      ],
      showImportDialog: false,
      codeObj: {},
      showDialog: false,
      generateConf: { fileName: '', type: 'file' }
    }
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  watch: {
    showDialog(val) {
      if (val) {
        const initValue = this.value
        this.tableList = initValue
        if (initValue.length > 0) {
          initValue.forEach((item) => {
            if (this.psColumnList.includes(item.type)) {
              this.psColumn[item.type] = true
            }
          })
        }
      }
    }
  },
  mounted() {
    this.resetPsColumn(this.value)
  },
  methods: {
    resetPsColumn(initValue) {
      this.psColumn = {
        index: false,
        selection: false,
        expand: false
      }
      if (initValue.length > 0) {
        this.tableList = initValue
        initValue.forEach((item) => {
          if (this.psColumnList.includes(item.type)) {
            this.psColumn[item.type] = true
          }
        })
      }
    },
    disableProp(row) {
      if (this.psColumnList.includes(row.type)) {
        return true
      }
      return false
    },
    // 插入伪列
    onClickColumn(val, row) {
      if (row) {
        this.tableList.unshift({ ...this.tablePseudoColumn[val] })
      } else {
        this.tableList = this.tableList.filter((item) => item.type !== val)
      }
    },
    // 导入数据框
    addData() {
      this.showImportDialog = true
    },
    onRowSort() {
      setTimeout(() => {
        this.tableList = this.$refs.gdtable.tableData
        this.$emit('input', this.tableList)
      }, 100)
    },
    submitImportData() {
      const importList = eval(`(${this.importData})`)
      this.tableList = importList.map((res, index) => {
        return {
          ...res,
          tId: index
        }
      })
      this.showImportDialog = false
    },
    // 表格删除添加一行
    delTable(row) {
      this.tableList = this.tableList.filter((item) => item.tId !== row.tId)
      this.resetPsColumn(this.tableList)
    },
    closedPreview() {
      this.showDialog = true
    },
    // 代码编辑
    codeEdit(row, index) {
      const canEdit = row.summary
      this.codeObj = { ...row, index }
      this.showDialog = false
      this.$refs.btnDrawer.onOpen({ compJavascript: row.compJavascript ? row.compJavascript + '#code#' : '', compView: row.compView || '', compCss: row.compCss || '' }, false)
    },
    saveCodeData({ htmlCode, jsCode, cssCode, otherJsCode }) {
      this.$set(this.tableList[this.codeObj.index], 'compJavascript', jsCode)
      this.$set(this.tableList[this.codeObj.index], 'compCss', cssCode)
      this.$set(this.tableList[this.codeObj.index], 'compView', htmlCode)
    },
    submit() {
      this.tableList = this.$refs.gdtable.tableData
      const list = this.tableList.filter((item) => !this.psColumnList.includes(item.type) && (!item.label || !item.prop))
      if (list.length) {
        this.$message.error('列表的字段名称、字段不能为空！')
        return
      }
      this.$emit('input', this.tableList)
      this.showDialog = false
    },
    // 添加列
    addCol() {
      this.tableStart.tId = 1000 + this.tableList.length || 1
      this.tableList.push({ ...this.tableStart })
    }
  }
}
</script>

<style lang="scss" scoped>
.addIcon {
  text-align: center;
  color: rgb(30, 129, 241);
  cursor: pointer;
}
.colitem {
  padding: 5px 0;
  margin-bottom: 8px;
  position: relative;
  span {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
