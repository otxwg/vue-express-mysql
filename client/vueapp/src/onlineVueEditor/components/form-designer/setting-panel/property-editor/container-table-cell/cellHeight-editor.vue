<template>
  <el-form-item :label="i18nt('designer.setting.cellHeight')">
    <el-input type="number" v-model="optionModel.cellHeight">
      <template slot="suffix">
        px
      </template>
    </el-input>
  </el-form-item>
</template>

<script>
import i18n from '../../../../../utils/i18n'

export default {
  name: 'cellHeight-editor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
