<template>
  <el-form-item :label="i18nt('designer.setting.defaultValue')">
    <el-input type="text" v-model="optionModel.defaultValue"></el-input>
    <!-- <el-input v-if="!hasConfig('optionItems')" type="text" v-model="optionModel.defaultValue" @change="emitDefaultValueChange"></el-input> -->
  </el-form-item>
</template>

<script>
import i18n from '../../../../utils/i18n'
import propertyMixin from './propertyMixin'

export default {
  name: 'defaultValue-editor',
  mixins: [i18n, propertyMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
