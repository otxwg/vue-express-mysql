<template>
  <el-form-item label="默认值">
    <el-time-picker
      size="mini"
      v-model="optionModel.defaultValue"
      @change="emitDefaultValueChange"
      :format="optionModel.format"
      value-format="HH:mm:ss"
      :editable="optionModel.editable"
    >
    </el-time-picker>
  </el-form-item>
</template>

<script>
import i18n from '../../../../../utils/i18n'
import propertyMixin from '../propertyMixin'

export default {
  name: 'time-defaultValue-editor',
  mixins: [i18n, propertyMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
