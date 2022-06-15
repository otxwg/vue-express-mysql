<template>
  <div v-show="showEchart" class="echart">
    <Header @handleFullScreen="handleFullScreen" />
    <div class="content-wrapper">
      <LeftSider :designer="designer" :echart-config="designer.echartConfig" @addChart="addChart" @openImportDialog="openImportDialog" />
      <Center
        :designer="designer"
        :echart-config="designer.echartConfig"
        v-bind="$attrs"
        v-on="$listeners"
        ref="center"
        :addChartType="addChartType"
        :config="config"
        :theme="theme"
        :background="background"
        :isFullSize="isFullSize"
      />
      <RightSider
        :designer="designer"
        :selected-widget="designer.selectedWidget"
        :echart-config="designer.echartConfig"
        v-on="$listeners"
        v-bind="$attrs"
        :addChartType="addChartType"
        @chooseBg="handleChooseBg"
        @selectTheme="selectTheme"
      />
    </div>
  </div>
</template>

<script>
import { createDesigner } from './echart'
import Header from './components/Header'
import LeftSider from './components/LeftSider'
import RightSider from './components/RightSider'
import Center from './components/Center'
export default {
  components: {
    Header,
    LeftSider,
    Center,
    RightSider
  },
  data() {
    return {
      showEchart: false,
      addChartType: '',
      dialogVisible: false,
      designer: createDesigner(this),
      options: '',
      config: '',
      configType: '',
      background: '',
      theme: '',
      isFullSize: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * @description 全屏
     */
    handleFullScreen() {
      this.isFullSize = !this.isFullSize
    },

    /**
     * @description 响应添加图表
     * @params {String} 图表类型
     */
    addChart(type) {
      this.addChartType = type
    },

    /**
     * @description 导入配置项
     */
    openImportDialog() {
      this.dialogVisible = true
    },

    /**
     * @description 响应对话框确定
     */
    importOptions() {
      if (!this.options) {
        this.$message.error('配置项不能为空')
      } else {
        this.config = this.options
        this.options = ''
        this.dialogVisible = false
      }
    },

    /**
     * @description 传递背景
     * @params {String} 图片
     */
    handleChooseBg(item) {
      this.background = item
    },
    selectTheme(name) {
      this.theme = name
    }
  }
}
</script>
<style lang="scss" scoped>
.echart {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: white;
  z-index: 2008;
  .content-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
  }
}
</style>
