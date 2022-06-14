<template>
  <div v-if="optionModel.styleObj">
    <el-form-item label="上内边距">
      <el-input size="mini" v-model="optionModel.styleObj.paddingTop"></el-input>
    </el-form-item>
    <el-form-item label="右内边距">
      <el-input size="mini" v-model="optionModel.styleObj.paddingRight"></el-input>
    </el-form-item>
    <el-form-item label="下内边距">
      <el-input size="mini" v-model="optionModel.styleObj.paddingBottom"></el-input>
    </el-form-item>
    <el-form-item label="左内边距">
      <el-input size="mini" v-model="optionModel.styleObj.paddingLeft"></el-input>
    </el-form-item>
    <el-form-item label="上外边距">
      <el-input size="mini" v-model="optionModel.styleObj.marginTop"></el-input>
    </el-form-item>
    <el-form-item label="右外边距">
      <el-input size="mini" v-model="optionModel.styleObj.marginRight"></el-input>
    </el-form-item>
    <el-form-item label="下外边距">
      <el-input size="mini" v-model="optionModel.styleObj.marginBottom"></el-input>
    </el-form-item>
    <el-form-item label="左外边距">
      <el-input size="mini" v-model="optionModel.styleObj.marginLeft"></el-input>
    </el-form-item>
    <el-form-item label="宽度">
      <el-input size="mini" v-model="optionModel.styleObj.width"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import i18n from '../../../../utils/i18n'

export default {
  name: 'marginPadding-editor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  mounted(){
    console.log(this.optionModel,' *-/-*/-*/')
  }
}
</script>

<style scoped></style>
