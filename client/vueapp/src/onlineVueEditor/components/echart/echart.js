import { deepClone, overwriteObj } from '../../utils/util'
export function createDesigner(vueInstance) {
  let defaultEchartConfig = {}

  return {
    widgetList: [],
    echartConfig: { cssCode: '' },

    selectedId: null,
    selectedWidget: null,
    selectedWidgetName: null, //选中组件名称（唯一）
    vueInstance: vueInstance,

    formWidget: null, //表单设计容器

    cssClassList: [], //自定义样式列表

    historyData: {
      index: -1, //index: 0,
      maxStep: 20,
      steps: []
    },

    initDesigner(decpData = '') {
      this.widgetList = []
      this.echartConfig = deepClone(defaultEchartConfig)
      // 如果没有保存过或者是编辑状态，则使用localstore的数据
      if (decpData !== '') {
        const editData = JSON.parse(decpData)
        this.widgetList = editData.widgetList
        overwriteObj(this.echartConfig, editData.echartConfig)
      } else {
        this.initHistoryData()
      }
    },

    clearDesigner(skipHistoryChange) {
      let emptyWidgetListFlag = this.widgetList.length === 0
      this.widgetList = []
      this.selectedId = null
      this.selectedWidgetName = null
      this.selectedWidget = {} //this.selectedWidget = null
      overwriteObj(this.echartConfig, defaultFormConfig) //

      if (!!skipHistoryChange) {
        //什么也不做！！
      } else if (!emptyWidgetListFlag) {
        this.emitHistoryChange()
      } else {
        this.saveCurrentHistoryStep()
      }
    },
    addContainerByDbClick(container) {
      this.widgetList.push(container)
    },
    setSelected(selected) {
      if (!selected) {
        this.clearSelected()
        return
      }

      this.selectedWidget = selected
      if (!!selected.id) {
        this.selectedId = selected.id
        this.selectedWidgetName = selected.options.name
      }
    }
  }
}
