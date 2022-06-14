<template>
  <div>
    <el-form-item label="盒子宽度">
      <el-input v-model="optionModel.boxWidth"></el-input>
    </el-form-item>
    <el-form-item label="盒子高度">
      <el-input v-model="optionModel.boxHeight"></el-input>
    </el-form-item>
  </div>
</template>

<script>

export default {
  name: "el-box-container-editor",
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  created() {
  },
  watch: {
    // 'boxConfig': {
    //   handler(nv, ov) {
    //     if (nv) {
    //       this.designer.options.obj['boxWidth']
    //     }
    //   }
    // }
  },
  computed: {
    // boxConfig() {
    //   const obj = this.optionModel
    //   obj['boxWidth'] = 100
    //   obj['boxHeight'] = 100
    //   return obj
    // }
  }
}
</script>

<style scoped>

</style>
