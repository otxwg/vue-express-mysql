<template>
  <div>
    <el-form-item :label="i18nt('designer.setting.labelWidth')">
      <el-input type="number" v-model="optionModel.labelWidth" @input.native="inputNumberHandler" min="0" class="hide-spin-button"></el-input>
    </el-form-item>
    <el-form-item label="组件宽度">
      <el-input type="text" v-model="optionModel.compwidth"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import i18n from '../../../../utils/i18n'
import propertyMixin from './propertyMixin'

export default {
  name: 'labelWidth-editor',
  mixins: [i18n, propertyMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
