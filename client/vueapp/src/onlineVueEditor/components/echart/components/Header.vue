<template>
  <div class="header-wrapper">
    <div class="left"></div>
    <div class="right">
      <el-button size="mini" @click="handleFullScreen">全屏</el-button>
      <el-button size="mini" @click="closeEchart">关闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: ''
    }
  },
  computed: {},
  data() {
    return {}
  },
  created() {},
  watch: {},
  methods: {
    /**
     * @description 响应全屏
     */
    handleFullScreen() {
      this.$emit('handleFullScreen')
    },
    closeEchart() {
      this.$parent.showEchart = false
    }
  }
}
</script>

<style lang="less" scoped>
.header-wrapper {
  padding: 0 20px;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #2d3c53;
}
</style>
