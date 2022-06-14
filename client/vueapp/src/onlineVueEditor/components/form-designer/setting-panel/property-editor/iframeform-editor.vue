<template>
  <div>
    <el-form-item label="地址">
      <el-input type="text" v-model="optionModel.url"></el-input>
    </el-form-item>
    <el-form-item label="宽度">
      <el-input type="text" v-model="optionModel.iframeWidth"></el-input>
    </el-form-item>
    <el-form-item label="高度">
      <el-input type="text" v-model="optionModel.iframeHeight"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import i18n from '../../../../utils/i18n'

export default {
  name: 'iframeform-editor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style scoped></style>
