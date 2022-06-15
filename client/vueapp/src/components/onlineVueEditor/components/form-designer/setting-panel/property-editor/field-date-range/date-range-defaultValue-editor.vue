<template>
  <el-form-item label="默认值">
    <el-date-picker
      size="mini"
      :type="optionModel.type"
      v-model="optionModel.defaultValue"
      @change="emitDefaultValueChange"
      :format="optionModel.format"
      :value-format="optionModel.valueFormat"
      :editable="optionModel.editable"
    >
    </el-date-picker>
  </el-form-item>
</template>

<script>
import i18n from '../../../../../utils/i18n'
import propertyMixin from '../propertyMixin'

export default {
  name: 'date-range-defaultValue-editor',
  mixins: [i18n, propertyMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
