<template>
  <el-color-picker v-model="optionModel.defaultValue" @change="emitDefaultValueChange"> </el-color-picker>
</template>

<script>
import i18n from '../../../../../utils/i18n'
import propertyMixin from '../propertyMixin'

export default {
  name: 'color-defaultValue-editor',
  mixins: [i18n, propertyMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
