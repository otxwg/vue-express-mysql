<template>
  <div class="field-wrapper" @click.stop="clickGdTable" :class="[selected ? 'selected' : '']">
    <div @click="showDialog" class="header" :style="{ background: searchConfig.headerBackground }">
      <div>
        <i v-if="searchConfig.prefixIcon" :class="searchConfig.prefixIcon" style="margin-right: 4px"></i><span class="title">{{ searchConfig.label }}</span>
      </div>
      <div>
        <i :class="[!searchConfig.showSearchFolded ? searchConfig.openIcon : searchConfig.closeIcon]"></i>
      </div>
    </div>
    <div v-if="!searchConfig.showSearchFolded" :style="{ background: searchConfig.bodyBackground }">
      <draggable
        :list="widget.rows"
        v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
        handle=".drag-handler"
        @end="(evt) => onGridDragEnd(evt, widget.rows)"
        @add="(evt) => onGridDragAdd(evt, widget.rows)"
        @update="onGridDragUpdate"
        :move="checkContainerMove"
      >
        <transition-group name="fade" tag="div" class="form-widget-list" style="min-height: 100px">
          <template v-for="(subWidget, swIdx) in widget.rows">
            <template v-if="'container' === subWidget.category">
              <component
                :is="subWidget.type + '-widget'"
                :widget="subWidget"
                :designer="designer"
                :key="subWidget.id"
                :parent-list="widget.rows"
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
                :parent-list="widget.rows"
                :index-of-parent-list="swIdx"
                :parent-widget="widget"
                :design-state="true"
              ></component>
            </template>
          </template>
        </transition-group>
      </draggable>
    </div>
    <template v-if="!!this.designer">
      <div class="field-action" v-if="designer.selectedId === field.id">
        <i class="el-icon-back" :title="i18nt('designer.hint.selectParentWidget')" @click.stop="selectParentWidget(field)"></i>
        <i class="el-icon-delete" :title="i18nt('designer.hint.remove')" @click.stop="removeFieldWidget"></i>
      </div>

      <div class="drag-handler background-opacity" v-if="designer.selectedId === field.id">
        <i class="el-icon-rank" :title="i18nt('designer.hint.dragHandler')"></i>
        <i>{{ i18n2t(`designer.widgetLabel.${field.type}`, `extension.widgetLabel.${field.type}`) }}</i>
        <i v-if="field.options.hidden === true" class="iconfont icon-hide"></i>
      </div>
    </template>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import i18n from '../../../../utils/i18n'
import FieldComponents from '../field-widget/index'
import { genVueData } from '../../../../utils/vue2js-generator'
export default {
  name: 'gdSearch-widget',
  componentName: 'FieldWidget', //必须固定为FieldWidget，用于接收父级组件的broadcast事件
  components: { ...FieldComponents, Draggable },
  mixins: [i18n],
  data() {
    return {
      // searchConfig.showSearchFolded: false,
      maximized: false,
      themeColor: 'rgb(30, 129, 241)',
      titleColor: '#fff'
    }
  },
  props: {
    field: Object,
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object
  },
  computed: {
    selected() {
      return !!this.designer && this.field.id === this.designer.selectedId
    },
    searchConfig() {
      return this.widget.options
    }
  },
  watch: {},
  mounted() {},
  methods: {
    showDialog() {
      this.searchConfig.showSearchFolded = !this.searchConfig.showSearchFolded
    },
    uid() {
      const rnd = Math.floor(Math.random() * 1000)
      const timestamp = new Date().getTime()
      return [timestamp, rnd].join('')
    },

    onGridDragEnd(evt, subList, prop) {},
    onGridDragAdd(evt, subList, item) {
      const newIndex = evt.newIndex
      if (!!subList[newIndex]) {
        this.designer.setSelected(subList[newIndex])
      }
      this.designer.emitHistoryChange()
    },
    onGridDragUpdate() {
      this.designer.emitHistoryChange()
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
    removeFieldWidget() {
      if (!!this.parentList) {
        let nextSelected = null
        if (this.parentList.length === 1) {
          if (!!this.parentWidget) {
            nextSelected = this.parentWidget
          }
        } else if (this.parentList.length === 1 + this.indexOfParentList) {
          nextSelected = this.parentList[this.indexOfParentList - 1]
        } else {
          nextSelected = this.parentList[this.indexOfParentList + 1]
        }

        this.$nextTick(() => {
          this.parentList.splice(this.indexOfParentList, 1)
          //if (!!nextSelected) {
          this.designer.setSelected(nextSelected)
          //}

          this.designer.emitHistoryChange()
        })
      }
    },
    clickGdTable() {
      this.designer.setSelected(this.widget)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../../styles/global.scss';

.design-time-bottom-margin {
  margin-bottom: 0px;
}

.field-wrapper {
  position: relative;
  background: #f4fbff;
  .field-action {
    position: absolute;
    //bottom: -24px;
    bottom: 0;
    right: -2px;
    height: 22px;
    line-height: 22px;
    background: $--color-primary;
    z-index: 9;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
    }
  }

  .drag-handler {
    position: absolute;
    top: 0;
    //bottom: -22px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
    left: 50%;
    height: 20px;
    line-height: 20px;
    background: $--color-primary;
    z-index: 9;

    i {
      font-size: 12px;
      font-style: normal;
      color: #fff;
      margin: 4px;
      cursor: move;
    }

    &:hover {
      //opacity: 1;
      background: $--color-primary;
    }
  }
}
.selected {
  outline: 2px solid $--color-primary;
}
.header {
  display: flex;
  justify-content: space-between;
  height: 40px;
  font-size: 14px;
  padding: 0 15px;
  line-height: 40px;
  border-bottom: 1px solid #d2dce4;
  cursor: pointer;
  .title {
    font-weight: 550;
    color: #000;
  }
}
</style>
