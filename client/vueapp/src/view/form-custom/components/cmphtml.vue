<script>
export default {
  name: 'Cmphtml',
  inheritAttrs: false,
  // eslint-disable-next-line vue/require-prop-types,vue/no-dupe-keys
  props: {
    html: String,
    css: String,
    js: String,
    widget: Object,
    designer: Object
  },
  render(h) {
    if (this.html !== '') {
      const jsData = this.js !== '' ? eval(`(${this.js})`) : null
      const com = Vue.extend({
        template: this.html,
        props: {
          widget: {
            type: Object,
            default: () => this.widget
          },
          designer: {
            type: Object,
            default: () => this.designer
          }
          // ...propsCommon
        },
        ...jsData
      })
      return h(com, {})
    }
  }
}
</script>
<style lang="scss" scoped></style>
