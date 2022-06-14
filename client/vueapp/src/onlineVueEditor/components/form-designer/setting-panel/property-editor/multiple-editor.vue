<template>
  <div>
    <el-form-item :label="i18nt('designer.setting.multiple')">
      <el-switch v-model="optionModel.multiple" @change="onMultipleSelected"></el-switch>
    </el-form-item>
    <!-- 是否折叠 -->
    <el-form-item v-if="optionModel.multiple" :label="i18nt('designer.setting.collapseTags')">
      <el-switch v-model="optionModel.collapseTags"></el-switch>
    </el-form-item>
  </div>
</template>

<script>
import i18n from '../../../../utils/i18n'
import propertyMixin from './propertyMixin'

export default {
  name: 'multiple-editor',
  mixins: [i18n, propertyMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
