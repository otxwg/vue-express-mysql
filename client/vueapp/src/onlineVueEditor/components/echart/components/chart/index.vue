<template>
  <gd-echart :width="echartWidth" :height="echartHeight" :options="option"> </gd-echart>
</template>

<script>
export default {
  name: 'chart',
  props: {
    theme: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 200
    },
    width: {
      type: Number,
      default: 200
    },
    option: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    echartWidth() {
      return this.width + 'px'
    },
    echartHeight() {
      return this.height + 'px'
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
