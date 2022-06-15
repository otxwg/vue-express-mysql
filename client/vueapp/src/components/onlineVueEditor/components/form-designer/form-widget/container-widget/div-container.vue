<template>
  <div
    :id="boxContainerId"
    :style="{width: boxWidth, height: boxHeight, backgroundColor: backgroundColor}"
    :class="[selected ? 'selected' : '', selected ? 'box-select-drag' : '']"
    style="position: relative;"
    @click.stop="selectWidget">
    <div >

    </div>
    <div class="box-config" v-if="selected">
      <i class="el-icon-back" :title="i18nt('designer.hint.selectParentWidget')" @click.stop="selectParentBoxConfig(widget)"></i>
      <i class="el-icon-delete" :title="i18nt('designer.hint.remove')" @click.stop="removeBoxConfig"></i>
    </div>
  </div>
</template>

<script>
import i18n from '../../../../utils/i18n'

export default {
  name: "div-container-widget",
  props: {
    widget: Object,
    field: Object,
    parentWidget: Object,
    parentList: Array,
    designer: Object
  },
  mixins: [i18n],
  data() {
    return {
      boxWidth: '80px',
      boxHeight:  '100px',
      backgroundColor: '#e26161',
      boxContainerId: 'el-box-' + new Date().getTime()
    }
  },
  computed: {
    selected() {
      return !!this.designer && this.field.id === this.designer.selectedId
    }
  },
  watch: {
    'widget': {
      handler(nv) {
        if (nv) {
          if (nv.options.boxWidth) {
            this.boxWidth = nv.options.boxWidth + 'px'
          }
          if (nv.options.boxHeight) {
            this.boxHeight = nv.options.boxHeight + 'px'
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
  },
  methods: {
    selectWidget() {
      this.designer.setSelected(this.widget)
      this.dealWithBox()
    },
    dealWithBox() {
      this.designer.boxConfigs.createBox(this.boxContainerId, this.widget)
    },
    removeBoxConfig() {
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
    selectParentBoxConfig() {
      if (this.parentWidget) {
        this.designer.setSelected(this.parentWidget)
      } else {
        this.designer.clearSelected()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../styles/global.scss';
.selected {
  outline: 2px solid $--color-primary;
}
.box-config {
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

  &:hover {
    //opacity: 1;
    background: $--color-primary;
  }
}
</style>
