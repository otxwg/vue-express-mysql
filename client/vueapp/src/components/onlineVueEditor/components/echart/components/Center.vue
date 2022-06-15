<template>
  <div class="center-wrapper">
    <!-- <div class="operation-wrapper">
      <el-button size="mini" @click="goBack">返回</el-button>
      <el-button size="mini" type="primary" @click="handleExportConfig">导出配置</el-button>
    </div> -->
    <div class="canvas-wrapper" ref="canvas">
      <template v-if="IsCanvasPrepared">
        <vue-draggable-resizable
          v-for="(item, index) in designer.widgetList"
          :key="item.id"
          :w="item.width"
          :h="item.height"
          :x="item.x"
          :y="item.y"
          :snap="true"
          :is-conflict-check="false"
          :parent="true"
          @dragging="onDrag"
          @resizing="onResize"
          @activated="onClickChart(item, index)"
          @deactivated="onMoveout(index)"
        >
          <chart :height="item.height" :width="item.width" :option="item.options" :theme="theme" />
          <div class="info">
            <div>x轴：{{ item.x }} 高度：{{ item.height }}</div>
            <div>y轴：{{ item.y }} 宽度：{{ item.width }}</div>
            <el-button class="icon-wrapper" size="mini" type="danger" plain @click="deleteTheChart(index)" icon="el-icon-delete"></el-button>
          </div>
        </vue-draggable-resizable>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Chart from './chart/index'
import ChartClass from '../assets/js/class/chart.js'
import screenfull from 'screenfull'
import { SCALE } from '../assets/js/constants/config.js'
// import FileSaver from 'file-saver'
const OTHER_CONFIG = ['background', 'theme']
import VueDraggableResizable from 'vue-draggable-resizable-gorkys'
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
import Minix from '../minx'
export default {
  mixins: [Minix],

  props: {
    designer: Object,
    echartConfig: Object,
    config: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: ''
    },
    isFullSize: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      fileId: +this.$route.params.id,
      currentChartList: [],
      IsCanvasPrepared: false,
      chartIndex: 0,
      screenHeight: 0,
      screenWidth: 0
    }
  },
  computed: {},

  created() {},
  watch: {
    config(val) {
      this.handleImportConfig(val)
    },
    background(val) {
      this.changeBg(val)
    },
    isFullSize(val) {
      this.handleFullScreen()
    }
  },

  mounted() {
    this.getScrollSize()

    // 监听全屏
    const that = this
    screenfull.on('change', () => {
      if (screenfull.isFullscreen) {
        that.scaleScreen(true)
      } else {
        that.scaleScreen(false)
      }
    })
  },

  beforeDestroy() {
    screenfull.off('change')
  },

  methods: {
    ...mapMutations(['scaleScreen', 'setCurrentChartList', 'fileListAdd', 'recordOriginChartList', 'restoreOriginChartList']),
    /**
     * @description 改变背景
     */
    changeBg(val) {
      this.$nextTick(() => {
        const a = this.$refs.canvas
        if (val.startsWith('#') || val.startsWith('rgb')) {
          a.style.backgroundImage = null
          a.style.backgroundSize = null
          a.style.background = val
        } else {
          a.style.background = null
          a.style.backgroundImage = `url(${val})`
          a.style.backgroundSize = 'cover'
        }
      })
    },
    /**
     * @description 全屏
     */
    handleFullScreen() {
      if (screenfull.isEnabled) {
        screenfull.request(this.$refs.canvas)
      }
    },

    /**
     * @description 响应图表缩放
     * @params {Array} 左上角(x,y)坐标，选中图形宽高
     */
    onResize(x, y, width, height) {
      this.$set(this.designer.widgetList[this.chartIndex], 'width', width)
      this.$set(this.designer.widgetList[this.chartIndex], 'height', height)
      this.$set(this.designer.widgetList[this.chartIndex], 'x', x)
      this.$set(this.designer.widgetList[this.chartIndex], 'y', y)
    },

    /**
     * @description 响应图表拖拽
     * @params {Array} 图形左上角(x,y)坐标
     */
    onDrag(x, y) {
      this.updateChart(this.designer.widgetList, {
        index: this.chartIndex,
        x,
        y
      })
    },

    onClickChart(item, index) {
      this.chartIndex = index
      this.designer.setSelected(item)
      const nodes = document.getElementsByClassName('info')
      nodes[index].style.opacity = 1
    },

    onMoveout(index) {
      const nodes = document.getElementsByClassName('info')
      nodes[index].style.opacity = 0
    },

    /**
     * @description 响应图表删除
     * @params {Number} 序号
     */
    deleteTheChart(index) {
      this.$confirm('是否删除改图表?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteChart(this.designer.widgetList, index)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {})
    },

    handleImportConfig(option) {
      this.addChart(
        this.designer.widgetList,
        new ChartClass({
          option: new Function('return ' + option)() /* eslint-disable-line */
        })
      )
    },

    /**
     * @description 修改画布元素宽高为屏幕大小
     */
    getScrollSize() {
      this.screenHeight = window.screen.height
      this.screenWidth = document.body.clientWidth
      this.$refs.canvas.style.setProperty('--canvasHeight', `${this.screenHeight / SCALE}px`)
      this.$refs.canvas.style.setProperty('--canvasWidth', `${this.screenWidth / SCALE}px`)
      this.IsCanvasPrepared = true
    },

    /**
     * @description 百分比转为像素值
     */
    calPercent(value, type) {
      return type === 'x' ? value / this.screenWidth : value / this.screenHeight
    },

    /**
     * @description 保存
     */
    goBack() {
      this.$confirm('是否保存当前文件?', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.fileId === -1) {
            // 屏幕快照
            setTimeout(() => {
              // 创建文件
              this.fileListAdd({
                id: Math.random(),
                createTime: new Date(),
                theme: this.theme,
                background: this.background,
                chartList: this.designer.widgetList,
                screenShot: res.src
              })
              this.$router.go(-1)
              this.setCurrentChartList()
              this.recordOriginChartList()
            }, 200)
          } else {
            setTimeout(() => {
              this.$router.go(-1)
              this.setCurrentChartList()
              this.recordOriginChartList()
            }, 200)
          }
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
        })
        .catch((action) => {
          if (action === 'cancel') {
            if (this.fileId !== -1) {
              this.restoreOriginChartList(this.fileId)
            }
            this.$router.go(-1)
            this.setCurrentChartList()
            this.recordOriginChartList()
          }
        })
    },

    /**
     * @description 响应导出配置
     */
    handleExportConfig() {
      const data = JSON.stringify(this.designer.widgetList)
      const blob = new Blob([data], { type: '' })
      // FileSaver.saveAs(blob, 'config.json')
    }
  },
  components: {
    Chart,
    VueDraggableResizable
  }
}
</script>

<style lang="less" scoped>
.center-wrapper {
  position: relative;
  width: calc(100% - 200px);
  height: calc(100% - 60px);
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: #f2f3f5;
  .operation-wrapper {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .canvas-wrapper {
    position: relative;
    width: var(--canvasWidth);
    height: var(--canvasHeight);
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 0 10px #d6dce0;
    outline: 10px solid #d6dce0;
    outline-offset: 0px;
    .info {
      opacity: 0;
      .icon-wrapper {
        position: absolute;
        bottom: -35px;
        right: 5px;
      }
    }
  }
}
</style>
