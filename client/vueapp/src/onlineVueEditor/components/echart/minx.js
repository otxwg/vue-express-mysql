export default {
  methods: {
    // 设置当前编辑的图表
    setCurEdit(state, data) {
      state.curEdit = data
    },

    // 当前画布添加图表
    addChart(currentChartList, data) {
      currentChartList.push(data)
    },

    // 更新图表
    updateChart(currentChartList, data) {
      currentChartList[data.index] = Object.assign(currentChartList[data.index], data)
    },

    // 删除图表
    deleteChart(currentChartList, index) {
      currentChartList.splice(index, 1)
    },

    // 设置当前图表列表
    setCurrentChartList(state, list = []) {
      state.currentChartList = list
    },

    // 文件删除
    fileListDelete(state, item) {
      const index = state.fileList.indexOf(item)
      state.fileList.splice(index, 1)
    },

    // 文件添加
    fileListAdd(state, item) {
      state.fileList.push(item)
    },

    fileListUpdate(state, item) {
      state.fileList = _.cloneDeep(item)
    },

    // 记录当前文件的原始数据
    recordOriginChartList(state, id) {
      const fileList = state.fileList
      const item = fileList.find((i) => +i.id === +id)
      if (item) {
        state.originChartList = _.cloneDeep(item)
      } else {
        state.originChartList = {}
      }
    },

    // 还原当前文件的原始数据
    restoreOriginChartList(state, id) {
      const fileList = state.fileList
      const index = fileList.findIndex((i) => +i.id === +id)
      if (index > -1) {
        fileList.splice(index, 1, state.originChartList)
      } else {
        Message.warning('未找到文件！')
      }
    },

    // 缩放屏幕
    scaleScreen(state, isGrow) {
      if (isGrow) {
        state.currentChartList.forEach((item) => {
          item.x = parseInt(item.x * SCALE)
          item.y = parseInt(item.y * SCALE)
          item.height = parseInt(item.height * SCALE)
          item.width = parseInt(item.width * SCALE)
        })
      } else {
        state.currentChartList.forEach((item) => {
          item.x = parseInt(item.x / SCALE)
          item.y = parseInt(item.y / SCALE)
          item.height = parseInt(item.height / SCALE)
          item.width = parseInt(item.width / SCALE)
        })
      }
    }
  }
}
