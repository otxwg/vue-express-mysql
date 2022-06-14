const lineOptions = require('./echarts-config/line')
const barOptions = require('./echarts-config/bar')
const pieOptions = require('./echarts-config/pie')
export const charts = [
  {
    id: '',
    name: '折线图',
    type: 'line',
    icon: 'echarts-line.png',
    options: lineOptions
  },
  {
    id: '',
    name: '柱状图',
    type: 'bar',
    icon: 'echarts-bar.png',
    options: barOptions
  },
  {
    id: '',
    name: '饼图',
    type: 'pie',
    icon: 'echarts-pie.png',
    options: pieOptions
  }
]
