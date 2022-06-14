<template>
  <el-col
    :id="widget.id"
    v-if="widget.type === 'grid-col'"
    class="grid-cell"
    v-bind="layoutProps"
    :class="[selected ? 'selected' : '', customClass]"
    :style="colHeightStyle"
    :key="widget.id"
    @click.native.stop="selectWidget(widget)"
  >
    <draggable
      :list="widget.widgetList"
      v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
      handle=".drag-handler"
      @end="(evt) => onGridDragEnd(evt, widget.widgetList)"
      @add="(evt) => onGridDragAdd(evt, widget.widgetList)"
      @update="onGridDragUpdate"
      :move="checkContainerMove"
    >
      <transition-group name="fade" tag="div" class="form-widget-list" :style="responsiveStyle">
        <template v-for="(subWidget, swIdx) in widget.widgetList">
          <template v-if="'container' === subWidget.category">
            <component
              :is="subWidget.type + '-widget'"
              :widget="subWidget"
              :designer="designer"
              :key="subWidget.id"
              :parent-list="widget.widgetList"
              :index-of-parent-list="swIdx"
              :parent-widget="widget"
            ></component>
          </template>
          <template v-else>
            <!-- :style="setStyle(subWidget)" -->
            <!-- <GdDrag
              :target="`#${widget.id}`"
              :key="subWidget.id"
              :style="{ left: subWidget.options.x + 'px', top: subWidget.options.y + 'px' }"
              @stop="stopDrag($event, subWidget)"
            > -->
            <component
              :key="subWidget.id"
              :is="subWidget.type + '-widget'"
              :field="subWidget"
              :designer="designer"
              :parent-list="widget.widgetList"
              :index-of-parent-list="swIdx"
              :parent-widget="widget"
              :design-state="true"
            ></component>
            <!-- </GdDrag> -->
          </template>
        </template>
      </transition-group>
    </draggable>

    <div class="grid-col-action" v-if="designer.selectedId === widget.id && widget.type === 'grid-col'">
      <i class="el-icon-back" :title="i18nt('designer.hint.selectParentWidget')" @click.stop="selectParentWidget(widget)"></i>
      <!-- <i class="el-icon-top" v-if="!!parentList && parentList.length > 1" :title="i18nt('designer.hint.moveUpWidget')" @click.stop="moveUpWidget()"></i>
      <i class="el-icon-bottom" v-if="!!parentList && parentList.length > 1" :title="i18nt('designer.hint.moveDownWidget')" @click.stop="moveDownWidget()"></i>
      <i class="el-icon-copy-document" :title="i18nt('designer.hint.cloneWidget')" @click.stop="cloneGridCol(widget)"></i> -->
      <i class="el-icon-delete" :title="i18nt('designer.hint.remove')" @click.stop="removeWidget"></i>
    </div>

    <!-- <div class="grid-col-handler" v-if="designer.selectedId === widget.id && widget.type === 'grid-col'">
      <i>{{ i18nt('designer.widgetLabel.' + widget.type) }}</i>
    </div> -->
  </el-col>
</template>

<script>
import Draggable from 'vuedraggable'
import i18n from '../../../../utils/i18n'
import FieldComponents from '../field-widget/index'
export default {
  name: 'GridColWidget',
  componentName: 'GridColWidget',
  mixins: [i18n],
  components: {
    Draggable,
    ...FieldComponents
  },
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,

    colHeight: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      responsiveStyle: { display: 'flex' },
      layoutProps: {
        span: this.widget.options.span || 12,
        // md: this.widget.options.md || 12,
        // sm: this.widget.options.sm || 12,
        // xs: this.widget.options.xs || 12,
        offset: this.widget.options.offset || 0,
        push: this.widget.options.push || 0,
        pull: this.widget.options.pull || 0
      }
    }
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },

    customClass() {
      return this.widget.options.customClass || ''
    },

    colHeightStyle() {
      let str = ''
      const style = this.widget.options.styleObj || {}
      Object.keys(style).forEach((k) => {
        let value = Number(style[k])
        if (!Number.isNaN(value)) {
          value += 'px'
        } else {
          value = style[k]
        }
        str += `${k}:${value};`
      })
      str = str + (this.colHeight ? `height:${this.colHeight}px;` : '')
      return str
    }
  },
  watch: {
    'designer.formConfig.layoutType': {
      handler(val) {
        if (this.widget.options.responsive) {
          if (val === 'H5') {
            this.layoutProps.span = this.widget.options.xs || 12
          } else if (val === 'Pad') {
            this.layoutProps.span = this.widget.options.sm || 12
          } else {
            this.layoutProps.span = this.widget.options.md || 12
          }
        } else {
          this.layoutProps.span = this.widget.options.span || 12
        }
      }
    },

    'widget.options.responsive': {
      handler(val) {
        // let lyType = this.designer.formConfig.layoutType
        if (val) {
          this.responsiveStyle = {
            display: 'flex'
          }
          // if (lyType === 'H5') {
          //   this.layoutProps.span = this.widget.options.xs || 12
          // } else if (lyType === 'Pad') {
          //   this.layoutProps.span = this.widget.options.sm || 12
          // } else {
          //   this.layoutProps.span = this.widget.options.md || 12
          // }
        } else {
          this.responsiveStyle = {
            display: 'block'
          }
          // this.layoutProps.span = this.widget.options.span || 12
        }
      },
      deep: true
    },

    'widget.options.span': {
      handler(val) {
        this.layoutProps.span = val
      }
    },

    'widget.options.md': {
      handler(val) {
        this.layoutProps.span = val
      }
    },

    'widget.options.sm': {
      handler(val) {
        this.layoutProps.span = val
      }
    },

    'widget.options.xs': {
      handler(val) {
        this.layoutProps.span = val
      }
    },

    'widget.options.offset': {
      handler(val) {
        this.layoutProps.offset = val
      }
    },

    'widget.options.push': {
      handler(val) {
        this.layoutProps.push = val
      }
    },

    'widget.options.pull': {
      handler(val) {
        this.layoutProps.pull = val
      }
    }
  },
  created() {
    this.initLayoutProps()
  },
  methods: {
    // 设置样式
    setStyle(val) {
      const newObj = {}
      const wop = val.options
      if (wop.x && wop.x !== null) {
        newObj.position = 'absolute'
        newObj.left = wop.x + 'px'
        newObj.top = wop.y + 'px'
      }
      return newObj
    },
    // 结束拖拽
    stopDrag(ev, val) {
      this.$set(val.options, 'x', ev.x)
      this.$set(val.options, 'y', ev.y)
    },
    initLayoutProps() {
      if (this.widget.options.responsive) {
        const lyType = this.designer.formConfig.layoutType
        if (lyType === 'H5') {
          this.layoutProps.span = this.widget.options.xs || 12
        } else if (lyType === 'Pad') {
          this.layoutProps.span = this.widget.options.sm || 12
        } else {
          this.layoutProps.span = this.widget.options.md || 12
        }
      } else {
        this.layoutProps.spn = this.widget.options.span
      }
    },

    onGridDragEnd(evt, subList) {
      //
    },

    onGridDragAdd(evt, subList) {
      const newIndex = evt.newIndex
      if (subList[newIndex]) {
        this.designer.setSelected(subList[newIndex])
      }

      this.designer.emitHistoryChange()
    },

    onGridDragUpdate() {
      this.designer.emitHistoryChange()
    },

    selectWidget(widget) {
      console.log('id: ' + widget.id)
      this.designer.setSelected(widget)
    },

    checkContainerMove(evt) {
      return this.designer.checkWidgetMove(evt)
    },

    selectParentWidget() {
      if (this.parentWidget) {
        this.designer.setSelected(this.parentWidget)
      } else {
        this.designer.clearSelected()
      }
    },

    moveUpWidget() {
      this.designer.moveUpWidget(this.parentList, this.indexOfParentList)
    },

    moveDownWidget() {
      this.designer.moveDownWidget(this.parentList, this.indexOfParentList)
    },

    cloneGridCol(widget) {
      this.designer.cloneGridCol(widget, this.parentWidget)
    },

    removeWidget() {
      if (this.parentList) {
        let nextSelected = null
        if (this.parentList.length === 1) {
          if (this.parentWidget) {
            nextSelected = this.parentWidget
          }
        } else if (this.parentList.length === 1 + this.indexOfParentList) {
          nextSelected = this.parentList[this.indexOfParentList - 1]
        } else {
          nextSelected = this.parentList[this.indexOfParentList + 1]
        }

        this.$nextTick(() => {
          this.parentList.splice(this.indexOfParentList, 1)
          // if (!!nextSelected) {
          this.designer.setSelected(nextSelected)
          // }

          this.designer.emitHistoryChange()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$--color-primary: #409eff;
.grid-cell {
  min-height: 38px;
  //margin: 6px 0;  /* 设置了margin，栅格列的offset、push、pull会失效！！ */
  padding: 3px;
  outline: 1px dashed #336699;
  position: relative;
  /deep/.el-form-item {
    margin-bottom: 0;
  }
  .form-widget-list {
    min-height: 28px;
  }

  .grid-col-action {
    position: absolute;
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

  .grid-col-handler {
    position: absolute;
    top: -2px;
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
      cursor: default;
    }
  }
}
</style>
