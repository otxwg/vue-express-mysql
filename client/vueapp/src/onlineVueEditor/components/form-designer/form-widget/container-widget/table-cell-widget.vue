<template>
  <td
    class="table-cell table-cell-td"
    align="center"
    :class="[selected ? 'selected' : '', customClass]"
    :style="{
      width: widget.options.cellWidth + 'px!important' || '',
      height: widget.options.cellHeight + 'px!important' || '',
      ...commonTdStyle(widget.options, widgetTable),
      ...tdStyle(widget.options, widgetTable)
    }"
    :colspan="widget.options.colspan || 1"
    :rowspan="widget.options.rowspan || 1"
    @click.stop="selectWidget(widget)"
    @dblclick="dbClickTd(widget)"
    @click="clickId(widget)"
    style="position: relative"
  >
<!--    <span>colIndex: {{colIndex}}</span>-->
    <span v-if="widget.isEdit && widget.showInput">{{ widget.initValue }}</span>
    <div class="gd_table_tr_td" v-if="widget.isEdit && !widget.showInput">
      <el-input class="el-input-class" v-model="widget.initValue" placeholder="请输入内容" @blur="blurInput(widget)"></el-input>
    </div>
    <draggable
      :title="'拖拽组件到这里'"
      v-if="!widget.isEdit"
      :list="widget.widgetList"
      class="draggable-div"
      v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
      handle=".drag-handler"
      @end="(evt) => onTableDragEnd(evt, widget.widgetList)"
      @add="(evt) => onTableDragAdd(evt, widget.widgetList)"
      @update="onTableDragUpdate"
      :move="checkContainerMove"
    >
      <transition-group name="fade" tag="div" class="form-widget-list">
        <template v-for="(subWidget, swIdx) in widget.widgetList">
          <template v-if="'container' === subWidget.category">
            <component
              :is="subWidget.type + '-widget'"
              :widget="subWidget"
              :designer="designer"
              :key="subWidget.id"
              :field="subWidget"
              :parent-list="widget.widgetList"
              :index-of-parent-list="swIdx"
              :parent-widget="widget"
            ></component>
          </template>
          <template v-else>
            <component
              :is="subWidget.type + '-widget'"
              :field="subWidget"
              :designer="designer"
              :key="subWidget.id"
              :parent-list="widget.widgetList"
              :index-of-parent-list="swIdx"
              :parent-widget="widget"
              :design-state="true"
            ></component>
          </template>
        </template>
        <!-- <template v-else>
          <component :is="'input-widget'" :designer="designer" :key="'input-widget-id'" :parent-list="[]" :index-of-parent-list="0" :parent-widget="{}"></component>
        </template>v-show="!widget.isEdit" -->
      </transition-group>
    </draggable>

    <div class="table-cell-action" v-if="designer.selectedId === widget.id && widget.type === 'table-cell'">
      <i class="el-icon-back" :title="i18nt('designer.hint.selectParentWidget')" @click.stop="selectParentWidget()"></i>
      <el-dropdown trigger="click" @command="handleTableCellCommand" size="small">
        <i class="el-icon-menu" :title="i18nt('designer.hint.cellSetting')"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="splitRowCol">拆分单元格</el-dropdown-item>
          <el-dropdown-item command="insertLeftCol">{{ i18nt('designer.setting.insertColumnToLeft') }}</el-dropdown-item>
          <el-dropdown-item command="insertRightCol">{{ i18nt('designer.setting.insertColumnToRight') }}</el-dropdown-item>
          <el-dropdown-item command="insertAboveRow">{{ i18nt('designer.setting.insertRowAbove') }}</el-dropdown-item>
          <el-dropdown-item command="insertBelowRow">{{ i18nt('designer.setting.insertRowBelow') }}</el-dropdown-item>
          <el-dropdown-item command="mergeLeftCol" :disabled="mergeLeftColDisabled" divided>{{ i18nt('designer.setting.mergeLeftColumn') }}</el-dropdown-item>
          <el-dropdown-item command="mergeRightCol" :disabled="mergeRightColDisabled">{{ i18nt('designer.setting.mergeRightColumn') }}</el-dropdown-item>
          <el-dropdown-item command="mergeWholeRow" :disabled="mergeWholeRowDisabled">{{ i18nt('designer.setting.mergeEntireRow') }}</el-dropdown-item>
          <el-dropdown-item command="mergeAboveRow" :disabled="mergeAboveRowDisabled" divided>{{ i18nt('designer.setting.mergeRowAbove') }}</el-dropdown-item>
          <el-dropdown-item command="mergeBelowRow" :disabled="mergeBelowRowDisabled">{{ i18nt('designer.setting.mergeRowBelow') }}</el-dropdown-item>
          <el-dropdown-item command="mergeWholeCol" :disabled="mergeWholeColDisabled">{{ i18nt('designer.setting.mergeEntireColumn') }}</el-dropdown-item>
          <el-dropdown-item command="undoMergeRow" :disabled="undoMergeRowDisabled" divided>{{ i18nt('designer.setting.undoMergeRow') }}</el-dropdown-item>
          <el-dropdown-item command="undoMergeCol" :disabled="undoMergeColDisabled">{{ i18nt('designer.setting.undoMergeCol') }}12</el-dropdown-item>
          <el-dropdown-item command="deleteWholeCol" :disabled="deleteWholeColDisabled" divided>{{ i18nt('designer.setting.deleteEntireCol') }}</el-dropdown-item>
          <el-dropdown-item command="deleteWholeRow" :disabled="deleteWholeRowDisabled">{{ i18nt('designer.setting.deleteEntireRow') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div v-show="!widget.isEdit" class="table-cell-handler" v-if="designer.selectedId === widget.id && widget.type === 'table-cell'">
      <i>{{ i18nt('designer.widgetLabel.' + widget.type) }}</i>
    </div>
    <gd-dialog :title="'拆分设置'" :z-index="2001" :closed.sync="showDialog" :append-to-body="true" height="200px" draggable maximizable :maximized.sync="maximized">
      <dir>
        <el-radio v-model="splitRadio" label="row">拆分成行</el-radio>
        <el-radio v-model="splitRadio" label="col">拆分成列</el-radio>
        <el-input-number size="small" v-model="splitNum" :min="2" :max="maxRow(widget.options)"></el-input-number>
      </dir>
      <template slot="footer">
        <div>
          <el-button size="small" type="primary" @click="splitRowCol">确认</el-button>
          <el-button size="small" @click="showDialog = false">取消</el-button>
        </div>
      </template>
    </gd-dialog>
  </td>
</template>

<script>
import Draggable from 'vuedraggable'
import i18n from '../../../../utils/i18n'
import FieldComponents from '../field-widget/index'

export default {
  name: 'TableCellWidget',
  componentName: 'TableCellWidget',
  mixins: [i18n],
  components: {
    Draggable,
    ...FieldComponents
  },
  data() {
    return {
      bg: '',
      splitRadio: 'row',
      splitNum: 2,
      showDialog: false
    }
  },
  props: {
    widget: Object,
    widgetTable: Object,
    parentWidget: Object,
    parentList: Array,
    oddEvenBg: String,
    rowIndex: Number,
    colIndex: Number,
    rowLength: Number,
    colLength: Number,
    colArray: Array,
    rowArray: Array,
    designer: Object
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },

    customClass() {
      return this.widget.options.customClass || ''
    },

    mergeLeftColDisabled() {
      return this.colIndex <= 0 || this.colArray[this.colIndex - 1].options.rowspan !== this.widget.options.rowspan
    },

    mergeRightColDisabled() {
      let rightColIndex = this.colIndex + this.widget.options.colspan
      return this.colIndex >= this.colLength - 1 || rightColIndex > this.colLength - 1 || this.colArray[rightColIndex].options.rowspan !== this.widget.options.rowspan
    },

    mergeWholeRowDisabled() {
      return this.colLength <= 1 || this.colLength === this.widget.options.colspan
    },

    mergeAboveRowDisabled() {
      return this.rowIndex <= 0 || this.rowArray[this.rowIndex - 1].cols[this.colIndex].options.colspan !== this.widget.options.colspan

      //return this.rowIndex <= 0
      //return (this.rowIndex <= 0) || (this.widget.options.colspan !== this.rowArray) //TODO
    },

    mergeBelowRowDisabled() {
      let belowRowIndex = this.rowIndex + this.widget.options.rowspan
      return (
        this.rowIndex >= this.rowLength - 1 ||
        belowRowIndex > this.rowLength - 1 ||
        this.rowArray[belowRowIndex].cols[this.colIndex].options.colspan !== this.widget.options.colspan
      )
    },

    mergeWholeColDisabled() {
      return this.rowLength <= 1 || this.rowLength === this.widget.options.rowspan
    },

    undoMergeColDisabled() {
      return this.widget.merged || this.widget.options.colspan <= 1
    },

    undoMergeRowDisabled() {
      return this.widget.merged || this.widget.options.rowspan <= 1
    },

    deleteWholeColDisabled() {
      //return this.colLength === 1
      return this.rowLength === 1 || this.widget.options.colspan === this.colLength
    },

    deleteWholeRowDisabled() {
      return this.rowLength === 1 || this.widget.options.rowspan === this.rowLength
    }
  },
  watch: {
    //
  },
  methods: {
    maxRow(res) {
      if (this.splitRadio === 'row' && res.rowspan > 1) {
        return res.rowspan
      }
      if (this.splitRadio === 'col' && res.colspan > 1) {
        return res.colspan
      }
    },
    blurInput(widget) {
      this.$set(widget, 'showInput', true)
    },
    clickId(widget) {
      this.$set(widget, 'showInput', false)
    },
    commonTdStyle(option, widgetTable) {
      if (option.commonBg !== '' && option.commonBg !== null) {
        this.bg = option.commonBg
      } else {
        if (this.oddEvenBg !== '' && this.oddEvenBg !== null) {
          this.bg = this.oddEvenBg
        } else {
          this.bg = widgetTable.commonBg
        }
      }
      const commonBorderWidth = this.returnValue(option, widgetTable, 'commonBorderWidth')
      const commonBorderType = this.returnValue(option, widgetTable, 'commonBorderType')

      return {
        background: this.bg,
        color: this.returnValue(option, widgetTable, 'commonColor'),
        fontSize: this.returnValue(option, widgetTable, 'commonSize'),
        textAlign: this.returnValue(option, widgetTable, 'commonCenter'),
        verticalAlign: this.returnValue(option, widgetTable, 'commonVer'),
        fontWeight: this.returnValue(option, widgetTable, 'commonWeight'),
        border: `${commonBorderWidth}px solid ${commonBorderType}`
      }
    },
    returnValue(option, widgetTable, type) {
      return option[type] ? option[type] : widgetTable[type]
    },
    tdStyle(option) {
      let strArr = option.cellStyle.replace(/\n/g, '').replace('{', '').replace('}', '').replace(/\r\n/g, '').replace(/\s/g, '').split(';')
      let newObj = {}
      strArr.forEach((element) => {
        if (element !== '') {
          const label = this.setNewStyle(element)[0]
          const val = this.setNewStyle(element)[1]
          newObj[label] = val
        }
      })
      return newObj
    },
    setNewStyle(arr) {
      const newArr = arr.split(':')
      return newArr
    },
    isJsonString(str) {
      try {
        if (typeof JSON.parse(str) === 'object') {
          return true
        }
      } catch (e) {
        console.log(e)
      }
      return false
    },
    dbClickTd(widget) {
      this.$set(widget, 'isEdit', !widget.isEdit)
      this.$set(widget, 'initValue', '')
    },
    selectWidget(widget) {
      this.designer.setSelected(widget)
    },

    checkContainerMove(evt) {
      return this.designer.checkWidgetMove(evt)
    },

    onTableDragEnd(obj, subList) {
      //
    },

    onTableDragAdd(evt, subList) {
      //重复代码，可合并
      const newIndex = evt.newIndex
      if (!!subList[newIndex]) {
        this.designer.setSelected(subList[newIndex])
      }

      this.designer.emitHistoryChange()
    },

    onTableDragUpdate() {
      this.designer.emitHistoryChange()
    },

    selectParentWidget() {
      if (this.parentWidget) {
        this.designer.setSelected(this.parentWidget)
      } else {
        this.designer.clearSelected()
      }
    },

    handleTableCellCommand(command) {
      if (command === 'insertLeftCol') {
        this.insertLeftCol()
      } else if (command === 'insertRightCol') {
        this.insertRightCol()
      } else if (command === 'insertAboveRow') {
        this.insertAboveRow()
      } else if (command === 'insertBelowRow') {
        this.insertBelowRow()
      } else if (command === 'mergeLeftCol') {
        this.mergeLeftCol()
      } else if (command === 'mergeRightCol') {
        this.mergeRightCol()
      } else if (command === 'mergeWholeCol') {
        this.mergeWholeCol()
      } else if (command === 'mergeAboveRow') {
        this.mergeAboveRow()
      } else if (command === 'mergeBelowRow') {
        this.mergeBelowRow()
      } else if (command === 'mergeWholeRow') {
        this.mergeWholeRow()
      } else if (command === 'undoMergeCol') {
        this.undoMergeCol()
      } else if (command === 'undoMergeRow') {
        this.undoMergeRow()
      } else if (command === 'deleteWholeCol') {
        this.deleteWholeCol()
      } else if (command === 'deleteWholeRow') {
        this.deleteWholeRow()
      } else if (command === 'splitRowCol') {
        this.showDialog = true
        // this.splitRowCol()
      }
    },

    insertLeftCol() {
      this.designer.insertTableCol(this.parentWidget, this.colIndex)
      this.updateColgroup('left')
    },
    splitRowCol() {
      this.designer.splitTabRowCol(this.widget, this.parentWidget, this.rowIndex, this.colIndex, this.splitNum, this.splitRadio)
      this.showDialog = false
    },
    insertRightCol() {
      this.designer.insertTableCol(this.parentWidget, this.colIndex + 1)
      this.updateColgroup('right')
    },
    insertAboveRow() {
      this.designer.insertTableRow(this.parentWidget, this.rowIndex, this.rowIndex)
    },

    insertBelowRow() {
      this.designer.insertTableRow(this.parentWidget, this.rowIndex + 1, this.rowIndex)
    },

    mergeLeftCol() {
      //this.designer.mergeTableColumn(this.colArray, this.colIndex, true)
      this.designer.mergeTableCol(this.rowArray, this.colArray, this.rowIndex, this.colIndex, true, this.widget)
    },

    mergeRightCol() {
      //this.designer.mergeTableColumn(this.colArray, this.colIndex, false)
      this.designer.mergeTableCol(this.rowArray, this.colArray, this.rowIndex, this.colIndex, false, this.widget)
    },

    mergeWholeRow() {
      this.designer.mergeTableWholeRow(this.rowArray, this.colArray, this.rowIndex, this.colIndex)
    },

    mergeAboveRow() {
      this.designer.mergeTableRow(this.rowArray, this.rowIndex, this.colIndex, true, this.widget)
    },

    mergeBelowRow() {
      this.designer.mergeTableRow(this.rowArray, this.rowIndex, this.colIndex, false, this.widget)
    },

    mergeWholeCol() {
      this.designer.mergeTableWholeCol(this.rowArray, this.colArray, this.rowIndex, this.colIndex)
    },

    undoMergeCol() {
      this.designer.undoMergeTableCol(this.rowArray, this.rowIndex, this.colIndex, this.widget.options.colspan, this.widget.options.rowspan)
    },

    undoMergeRow() {
      this.designer.undoMergeTableRow(this.rowArray, this.rowIndex, this.colIndex, this.widget.options.colspan, this.widget.options.rowspan)
    },

    deleteWholeCol() {
      this.designer.deleteTableWholeCol(this.rowArray, this.colIndex)
      this.updateColgroup('del')
    },

    deleteWholeRow() {
      this.designer.deleteTableWholeRow(this.rowArray, this.rowIndex)
    },
    // 更新table下的Colgroup
    updateColgroup(type) {
      const table = this.$el.parentElement.parentElement.parentElement
      const obj = this.designer.dragLine.getColNum(table, this.$el)
      this.designer.dragLine.averageColgroupCol(table, type, obj)
    }
  }
}
</script>
<style lang="scss">
.gd_table_tr_td {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-input__inner {
    background: transparent;
    border: 1px solid transparent;
  }
}
</style>
<style lang="scss" scoped>
$--color-primary: #409eff;

.table-cell {
  //padding: 3px;
  border: 1px dashed #336699;
  display: table-cell;
  position: relative;

  .draggable-div {
    position: relative;
    height: 100%;
  }

  .form-widget-list {
    height: 100%;
    .el-form-item {
      margin-bottom: 0px;
    }
    // border: 1px dashed #336699;
    // margin: 3px;

    // position: absolute;
    // top: 0;
    // right: 0;
    // bottom: 0;
    // left: 0;
  }

  .table-cell-action {
    position: absolute;
    //bottom: -30px;
    bottom: 0;
    right: -2px;
    height: 28px;
    line-height: 28px;
    background: $--color-primary;
    z-index: 999;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
    }
  }

  .table-cell-handler {
    position: absolute;
    top: -2px;
    //bottom: -24px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
    left: -2px;
    height: 22px;
    line-height: 22px;
    background: $--color-primary;
    z-index: 9;

    i {
      font-size: 14px;
      font-style: normal;
      color: #fff;
      margin: 4px;
      cursor: default; //cursor: move;
    }
  }
}

.table-cell.selected {
  outline: 2px solid $--color-primary !important;
}
</style>
