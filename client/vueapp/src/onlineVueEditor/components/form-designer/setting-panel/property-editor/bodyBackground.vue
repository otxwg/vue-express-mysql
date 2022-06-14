<template>
  <el-form-item :label="i18nt('designer.setting.bodyBackground')" style="height: 32px; margin-bottom: 0px !important">
    <el-color-picker v-model="optionModel.bodyBackground"> </el-color-picker>
  </el-form-item>
</template>

<script>
import i18n from '../../../../utils/i18n'

export default {
  name: 'bodyBackground-editor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>
