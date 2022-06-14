<template>
  <div>
    <el-form-item label="高度">
      <el-input type="text" v-model="optionModel.otherConfig.height"></el-input>
    </el-form-item>
    <el-form-item label="最大高度">
      <el-input type="text" v-model="optionModel.otherConfig['max-height']"></el-input>
    </el-form-item>
    <el-form-item label="是否为斑马纹">
      <el-switch v-model="optionModel.otherConfig.stripe" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
    </el-form-item>
    <el-form-item label="是否边框">
      <el-switch v-model="optionModel.otherConfig.border" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
    </el-form-item>
    <el-form-item label="自动计算行数">
      <el-switch v-model="optionModel.otherConfig.isTableAuto" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
    </el-form-item>
    <el-form-item v-if="optionModel.otherConfig.isTableAuto" label="自动计算每行高度">
      <el-input type="number" v-model="optionModel.otherConfig['row-height']">
        <template slot="append">px</template>
      </el-input>
    </el-form-item>
    <el-form-item label="表格尺寸">
      <el-select v-model="optionModel.otherConfig.size" placeholder="请选择">
        <el-option key="medium " label="medium " value="medium "> </el-option>
        <el-option key="small" label="small" value="small"> </el-option>
        <el-option key="mini" label="mini" value="mini"> </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import i18n from '../../../../../utils/i18n'

export default {
  name: 'TableConfig',
  mixins: [i18n],
  props: {
    optionModel: Object
  },
  computed: {}
}
</script>

<style scoped></style>
