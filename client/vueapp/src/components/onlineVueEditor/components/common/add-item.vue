<script>
function setCss(templateCss) {
  // 动态插入css
  const css = templateCss
  const head = document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  style.type = 'text/css'
  if (style.styleSheet) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
  head.appendChild(style)
}
import Vue from 'vue'
export default {
  name: 'Preview',
  // eslint-disable-next-line vue/require-prop-types
  props: ['itemData', 'rowData', 'pageParams'],
  render(h) {
    // 设置样式

    const templeteData = this.itemData

    const dataHtml = templeteData[`compView`]
    const dataCss = templeteData[`compCss`]
    const dataJs = templeteData[`compJavascript`] === '' ? {} : eval(`(${templeteData[`compJavascript`]})`)
    setCss(dataCss)
    // 引入插槽
    const slots = Object.keys(this.$slots)
      .reduce((arr, key) => arr.concat(this.$slots[key]), [])
      .map((vnode) => {
        vnode.context = this._self
        return vnode
      })
    if (dataHtml !== '' && dataHtml !== undefined) {
      const result = Vue.extend({
        props: {
          itemData: {
            type: Object,
            default: () => {
              return this.itemData
            }
          },
          scope: {
            type: Object,
            default: () => {
              return this.rowData
            }
          },
          pageParams: {
            type: Object,
            default: () => {
              return this.pageParams || { current: 1, size: 10 }
            }
          }
        },
        template: dataHtml,
        ...dataJs
      })
      return h(result, {}, slots)
    }
  }
}
</script>
