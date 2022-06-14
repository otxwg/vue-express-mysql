<template>
  <container-wrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList">
    <div :key="widget.id" class="table-container-gd" :class="[selected ? 'selected' : '', customClass]" @click.stop="selectWidget(widget)">
      <table
        class="table-layout"
        :style="{
          width: widget.options.cellWidth + 'px!important' || '',
          height: widget.options.cellHeight + 'px!important' || '',
          ...tdStyle(widget.options)
        }"
      >
        <colgroup>
          <col v-for="col in tdNum" :key="'el' + col" :width="colGroupWidth(widget.rows)">
        </colgroup>
        <tbody>
        <tr v-for="(row, rowIdx) in widget.rows" :key="row.id">
          <template v-for="(colWidget, colIdx) in row.cols">
            <table-cell-widget
              v-if="!colWidget.merged"
              :odd-even-bg="colIdx % 2 === 0 ? widget.options.oddBg : widget.options.evenBg"
              :widget="colWidget"
              :widget-table="widget.options"
              :designer="designer"
              :key="colWidget.id"
              :parent-list="widget.cols"
              :row-index="rowIdx"
              :row-length="widget.rows.length"
              :col-index="colIdx"
              :col-length="row.cols.length"
              :col-array="row.cols"
              :row-array="widget.rows"
              :parent-widget="widget"
            ></table-cell-widget>
          </template>
        </tr>
        </tbody>
      </table>
    </div>
  </container-wrapper>
</template>

<script>
import i18n from '../../../../utils/i18n'
import containerMixin from './containerMixin'
import ContainerWrapper from './container-wrapper'
import TableCellWidget from './table-cell-widget'
// Vue.directive('longpress', {
//   bind: function(el, binding, vNode) {
//     // 定义变量
//     let pressTimer = null;
//     // 定义函数处理程序
//     // 创建计时器（ 1秒后执行函数 ）
//     let start = (e) => {
//       if (e.type === 'click' && e.button !== 0) {
//         return;
//       }
//       if (pressTimer === null) {
//         pressTimer = setTimeout(() => {
//           // 执行函数
//           handler();
//         }, 1000)
//       }
//     }
//     // 停止计时器
//     let cancel = (e) => {
//       // 检查是否有正在运行的计时器
//       if ( pressTimer !== null ) {
//         clearTimeout(pressTimer);
//         pressTimer = null;
//       }
//     }
//     // 运行函数
//     const handler = (e) => {
//       // 执行传递给指令的方法
//       binding.value(e)
//     }
//     // 添加事件监听器
//     el.addEventListener("mousedown", start);
//
//     // 取消计时器
//     el.addEventListener("click", cancel);
//
//     el.addEventListener("mouseout", cancel);
//
//   }
// })
export default {
  name: 'table-widget',
  componentName: 'ContainerWidget',
  mixins: [i18n, containerMixin],
  components: {
    ContainerWrapper,
    TableCellWidget
  },
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object
  },
  data() {
    return {
      tdNum: 0
    }
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },

    customClass() {
      return this.widget.options.customClass || ''
    }
  },
  watch: {
    'widget.rows': {
      handler(nv, ov) {
        if (nv) {
          this.designer.dragLine.containersIn(this.designer)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getColNum()
  },
  methods: {
    handleClick(item, vm) {
      // 处理点击菜单后的触发动作
      this.$message.success(`点击了${item.label}`)
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
      return arr.split(':')
    },
    // col生成宽度比
    colGroupWidth(row) {
      return (100 / this.tdNum).toFixed(2) + '%'
    },
    // colNum
    getColNum() {
      this.designer.dragLine.tableCellBorder()
      const tableList = document.getElementsByClassName('table-layout')
      let isT = 0
      for(let t = 0 ; t < tableList.length;t++) {
        if (tableList[t] === this.$el.firstChild.children[0]) {
          isT = t
          break
        }
      }
      this.tdNum = this.designer.dragLine.tdNum[isT]
    }
  }
}
</script>

<style lang="scss" scoped>
$--color-primary: #409eff;
.table-container-gd {
  padding: 5px;
  // border: 1px dashed #336699;
  box-sizing: border-box;

  table.table-layout {
    width: 100%;
    text-align: center;
    //border: 1px solid #c8ebfb;
    border-collapse: collapse;
    table-layout: fixed;

    td {
      height: 36px;
      border: 1px solid #e5e5e5;
      padding: 3px;
      display: table-cell;
    }

    .form-widget-list {
      border: 1px dashed #336699;
      min-height: 36px;
    }
  }
}

.table-container.selected {
  outline: 2px solid $--color-primary !important;
}

</style>
