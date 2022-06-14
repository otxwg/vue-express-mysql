<template>
  <div>
    <el-form-item :label="i18nt('designer.setting.gridColHeight')">
      <el-input type="number" v-model="optionModel.colHeight" @input.native="inputNumberHandler" min="0" class="hide-spin-button"></el-input>
    </el-form-item>
    <!-- <el-form-item :label="i18nt('designer.setting.gutter')">
      <el-input-number v-model="optionModel.gutter" style="width: 100%"></el-input-number>
    </el-form-item> -->
  </div>
</template>

<script>
import i18n from '../../../../../utils/i18n'
import propertyMixin from '../propertyMixin'

export default {
  name: 'colHeight-editor',
  mixins: [i18n, propertyMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
}
</script>

<style scoped></style>
