<template>
  <drawer>
    <chartConfig :designer="designer" :selected-widget="designer.selectedWidget" />
  </drawer>
</template>

<script>
import drawer from './drawer'
import chartConfig from './chartConfig/index'
export default {
  components: {
    drawer,
    chartConfig
  },
  props: {
    designer: Object,
    echartConfig: Object,
    selectedWidget: Object
  },
  data() {
    return {
      showPage: true
    }
  },
  computed: {
    optionModel: {
      get() {
        return this.selectedWidget?.options || {}
      },

      set(newValue) {
        this.selectedWidget.options = newValue
      }
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss"></style>
