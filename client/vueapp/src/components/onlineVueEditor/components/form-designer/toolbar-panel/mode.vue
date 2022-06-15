<template>
  <div class="toolbar-container">
    <div class="left-toolbar">
      <el-button size="small" type="text" :disabled="undoDisabled" :title="i18nt('designer.toolbar.undoHint')" @click="undoHistory">
        <span style="padding-left: 25px; position: relative">
          <img style="width: 14px; position: absolute; top: 2px; left: 5px" src="../../../icons/svg/undo.svg" alt="" />
        </span>
      </el-button>
      <el-button size="small" type="text" :disabled="redoDisabled" :title="i18nt('designer.toolbar.redoHint')" @click="redoHistory">
        <span style="padding-left: 25px; position: relative">
          <img style="width: 14px; position: absolute; top: 2px; left: 5px" src="../../../icons/svg/redo.svg" alt="" />
        </span>
      </el-button>
      <el-button-group style="margin-left: 20px" v-show="false">
        <el-button
          style="border-radius: 6px 6px 0px 0px"
          :class="[layoutType === 'PC' ? 'toolbar-btn-active' : 'toolbar-btn']"
          size="small"
          :type="layoutType === 'PC' ? 'primary' : ''"
          @click="changeLayoutType('PC')"
        >
          {{ i18nt('designer.toolbar.pcLayout') }}</el-button
        >
        <el-button
          style="border-radius: 6px 6px 0px 0px"
          :class="[layoutType === 'Pad' ? 'toolbar-btn-active' : 'toolbar-btn']"
          size="small"
          :type="layoutType === 'Pad' ? 'primary' : ''"
          @click="changeLayoutType('Pad')"
        >
          {{ i18nt('designer.toolbar.padLayout') }}</el-button
        >
        <el-button
          style="border-radius: 6px 6px 0px 0px"
          :class="[layoutType === 'H5' ? 'toolbar-btn-active' : 'toolbar-btn']"
          size="small"
          :type="layoutType === 'H5' ? 'primary' : ''"
          @click="changeLayoutType('H5')"
        >
          {{ i18nt('designer.toolbar.mobileLayout') }}</el-button
        >
      </el-button-group>
    </div>
    <div class="right-toolbar">
      <el-button size="small" type="text" style="margin-left: 20px" :title="i18nt('designer.toolbar.nodeTreeHint')" @click="showNodeTreeDrawer">
        <span style="padding-left: 25px; position: relative">
          <img style="width: 14px; position: absolute; top: 2px; left: 5px" src="../../../icons/svg/node-tree.svg" alt="" />
        </span>
      </el-button>
    </div>

    <el-drawer
      :title="i18nt('designer.toolbar.nodeTreeTitle')"
      direction="ltr"
      :visible.sync="showNodeTreeDrawerFlag"
      :modal="false"
      :size="280"
      :destroy-on-close="true"
      class="node-tree-drawer"
    >
      <el-tree
        ref="nodeTree"
        :data="nodeTreeData"
        node-key="id"
        default-expand-all
        highlight-current
        class="node-tree"
        icon-class="el-icon-arrow-right"
        @node-click="onNodeTreeClick"
      ></el-tree>
    </el-drawer>
  </div>
</template>

<script>
import { traverseAllWidgets } from '../../../utils/util'
import i18n from '../../../utils/i18n'

export default {
  name: 'mode',
  mixins: [i18n],
  components: {},
  props: {
    designer: Object
  },

  data() {
    return {
      maximized: true,
      showNodeTreeDrawerFlag: false,
      nodeTreeData: []
    }
  },
  computed: {
    undoDisabled() {
      return !this.designer.undoEnabled()
    },

    redoDisabled() {
      return !this.designer.redoEnabled()
    },

    layoutType() {
      return this.designer.getLayoutType()
    }
  },
  watch: {
    'designer.widgetList': {
      deep: true,
      handler(val) {}
    }
  },
  methods: {
    buildTreeNodeOfWidget(widget, treeNode) {
      const curNode = {
        id: widget.id,
        label: widget.options.label || widget.type
        // selectable: true,
      }
      treeNode.push(curNode)

      if (widget.category === undefined) {
        return
      }

      curNode.children = []
      if (widget.type === 'grid') {
        widget.cols?.map((col) => {
          let colNode = {
            id: col.id,
            label: col.options.name || widget.type,
            children: []
          }
          curNode.children.push(colNode)
          col.widgetList?.map((wChild) => {
            this.buildTreeNodeOfWidget(wChild, colNode.children)
          })
        })
      } else if (widget.type === 'grid-col') {
        widget.widgetList.map((wChild) => {
          this.buildTreeNodeOfWidget(wChild, curNode.children)
        })
      } else if (widget.type === 'table') {
        // TODO: 需要考虑合并单元格！！
        widget.rows.map((row) => {
          const rowNode = {
            id: row.id,
            label: 'table-row',
            selectable: false,
            children: []
          }
          curNode.children.push(rowNode)

          row.cols.map((cell) => {
            if (cell.merged) {
              // 跳过合并单元格！！
              return
            }

            const rowChildren = rowNode.children
            const cellNode = {
              id: cell.id,
              label: 'table-cell',
              children: []
            }
            rowChildren.push(cellNode)

            cell.widgetList.map((wChild) => {
              this.buildTreeNodeOfWidget(wChild, cellNode.children)
            })
          })
        })
      } else if (widget.type === 'tab') {
        widget.tabs.map((tab) => {
          const tabNode = {
            id: tab.id,
            label: tab.options.name || widget.type,
            selectable: false,
            children: []
          }
          curNode.children.push(tabNode)
          tab.widgetList.map((wChild) => {
            this.buildTreeNodeOfWidget(wChild, tabNode.children)
          })
        })
      } else if (widget.type === 'sub-form') {
        widget.widgetList.map((wChild) => {
          this.buildTreeNodeOfWidget(wChild, curNode.children)
        })
      } else if (widget.type === 'gdSearch') {
        widget.rows?.map((col) => {
          const colNode = {
            id: col.id,
            label: col.options.name || widget.type,
            children: []
          }
          curNode.children.push(colNode)
          col.widgetList?.map((wChild) => {
            this.buildTreeNodeOfWidget(wChild, colNode.children)
          })
          col.cols?.map((cell) => {
            this.buildTreeNodeOfWidget(cell, colNode.children)
          })
        })
      } else if (widget.category === 'container') {
        // 自定义容器
        widget.widgetList.map((wChild) => {
          this.buildTreeNodeOfWidget(wChild, curNode.children)
        })
      }
    },

    refreshNodeTree() {
      this.nodeTreeData.length = 0
      this.designer.widgetList.forEach((wItem) => {
        this.buildTreeNodeOfWidget(wItem, this.nodeTreeData)
      })
    },

    showNodeTreeDrawer() {
      this.refreshNodeTree()
      this.showNodeTreeDrawerFlag = true
      this.$nextTick(() => {
        if (this.designer.selectedId) {
          // 同步当前选中组件到节点树！！！
          this.$refs.nodeTree.setCurrentKey(this.designer.selectedId)
        }
      })
    },

    undoHistory() {
      this.designer.undoHistoryStep()
    },

    redoHistory() {
      this.designer.redoHistoryStep()
    },

    changeLayoutType(newType) {
      this.designer.changeLayoutType(newType)
    },

    findWidgetById(wId) {
      let foundW = null
      traverseAllWidgets(this.designer.widgetList, (w) => {
        if (w.id === wId) {
          foundW = w
        }
      })
      return foundW
    },

    onNodeTreeClick(nodeData, node, nodeEl) {
      if (nodeData.selectable !== undefined && !nodeData.selectable) {
        this.$message.info(this.i18nt('designer.hint.currentNodeCannotBeSelected'))
      } else {
        const selectedId = nodeData.id
        const foundW = this.findWidgetById(selectedId)
        if (foundW) {
          this.designer.setSelected(foundW)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar-container {
  background: #ecf5ff;
}

.left-toolbar {
  float: left;
  margin-top: 4px;
  font-size: 16px;
  .toolbar-btn {
    width: 88px;
    height: 36px;
    background: #ecf5ff;
    border: none;
    color: #606266;
    box-sizing: border-box;
    margin-top: -1px;
  }
  .toolbar-btn-active {
    width: 88px;
    background: #ffffff;
    border: none;
    color: #489dff;
    height: 37px;
    padding-top: 6px;
  }
}

.right-toolbar {
  float: right;
  margin-top: 3px;

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
    content: '';
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: '';
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
</style>
