<template>
  <form-item-wrapper
    :designer="designer"
    :field="field"
    :rules="rules"
    :design-state="designState"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <gd-selectTree
      ref="fieldEditor"
      :cur-value="fieldModel"
      :data="selectorOptions"
      :obj="selectProps"
      :size="field.options.size"
      :multiple="field.options.multiple"
      :check-strictly="field.options.checkStrictly"
      :clearable="field.options.clearable"
      :filterable="field.options.collapseTags"
      :collapse-tags="field.options.collapseTags"
      :placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
      @getValue="onGetValueActivities"
    />
  </form-item-wrapper>
</template>

<script>
import FormItemWrapper from './form-item-wrapper'
import emitter from 'element-ui/lib/mixins/emitter'
import i18n, { translate } from '../../../../utils/i18n'
import fieldMixin from './fieldMixin'
import widgetOptions from './widgetOptions'
export default {
  name: 'select-tree-widget',
  componentName: 'FieldWidget', // 必须固定为FieldWidget，用于接收父级组件的broadcast事件
  mixins: [emitter, fieldMixin, widgetOptions, i18n],
  props: {
    field: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,

    designState: {
      type: Boolean,
      default: false
    },

    subFormRowIndex: {
      /* 子表单组件行索引，从0开始计数 */
      type: Number,
      default: -1
    },
    subFormColIndex: {
      /* 子表单组件列索引，从0开始计数 */
      type: Number,
      default: -1
    },
    subFormRowId: {
      /* 子表单组件行Id，唯一id且不可变 */
      type: String,
      default: ''
    }
  },
  components: {
    FormItemWrapper
  },
  inject: ['refList', 'formConfig', 'globalOptionData', 'globalModel'],
  data() {
    return {
      oldFieldValue: null, // field组件change之前的值
      fieldModel: null,
      rules: []
    }
  },
  computed: {
    options() {
      const data = this.selectorOptions
      this.changeTree(data)
      return data
    }
  },
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
    this.initOptionItems()
    this.initFieldModel()
    this.registerToRefList()
    this.initEventHandler()
    this.buildFieldRules()

    this.handleOnCreated()
  },

  mounted() {
    this.handleOnMounted()
    this.initData()
  },

  beforeDestroy() {
    this.unregisterFromRefList()
  },

  methods: {
    onGetValueActivities(val) {
      this.$set(this, 'fieldModel', val)
    },
    changeTree(data) {
      data.map((i) => {
        if (i[this.selectProps.children] && !i[this.selectProps.children].length) {
          delete i[this.selectProps.children]
        } else if (i[this.selectProps.children]) {
          this.changeTree(i[this.selectProps.children])
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../styles/global.scss'; //* form-item-wrapper已引入，还需要重复引入吗？ *//

.full-width-input {
  width: 100% !important;
}
</style>
