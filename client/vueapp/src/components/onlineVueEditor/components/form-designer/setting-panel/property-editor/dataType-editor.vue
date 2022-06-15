<template>
  <div>
    <el-form-item label="数据类型">
      <el-select v-model="optionModel.datatype" placeholder="请选择" class="el-width-p100">
        <el-option label="字符串" value="varchar" />
        <el-option label="数字" value="number" />
        <el-option label="日期" value="date" />
      </el-select>
    </el-form-item>
    <el-form-item label="字符长度">
      <el-input v-model="optionModel.length" />
    </el-form-item>
  </div>
</template>

<script>
// import { mounted } from '../../../../../../../../static/wfmng/smform/components/cascader/cascader.vue'
import i18n from '../../../../utils/i18n'

export default {
  name: 'dataType-editor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  computed: {}
}
</script>

<style lang="scss" scoped></style>
