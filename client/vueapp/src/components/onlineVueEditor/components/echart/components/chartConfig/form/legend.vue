<template>
  <div>
    <el-form ref="form" :model="echartOption" label-width="150px" label-position="left" label-suffix="：">
      <el-form-item label="是否显示图例组件" prop="show">
        <el-switch size="mini" v-model="echartOption.show"></el-switch>
      </el-form-item>
      <el-form-item label="显示数据" prop="data">
        <el-input size="mini" v-model="echartOption.data" placeholder="请输入要显示的图例，用空格分隔"></el-input>
      </el-form-item>
      <el-form-item label="图例的类型" prop="type">
        <el-select size="mini" v-model="echartOption.type">
          <el-option value="plain">普通图例</el-option>
          <el-option value="scroll">可滚动翻页的图例</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="离容器左侧的距离" prop="left">
        <el-input size="mini" v-model="echartOption.left"></el-input>
      </el-form-item>
      <el-form-item label="离容器右侧的距离" prop="right">
        <el-input size="mini" v-model="echartOption.right"></el-input>
      </el-form-item>
      <el-form-item label="离容器上侧的距离" prop="top">
        <el-input size="mini" v-model="echartOption.top"></el-input>
      </el-form-item>
      <el-form-item label="离容器下侧的距离" prop="bottom">
        <el-input size="mini" v-model="echartOption.bottom"></el-input>
      </el-form-item>
      <el-form-item label="高度" prop="height">
        <el-input size="mini" v-model="echartOption.height"></el-input>
      </el-form-item>
      <el-form-item label="宽度" prop="width">
        <el-input size="mini" v-model="echartOption.width"></el-input>
      </el-form-item>
      <el-form-item label="布局朝向" prop="orient">
        <el-select size="mini" v-model="echartOption.orient">
          <el-option value="horizontal">水平</el-option>
          <el-option value="vertical">垂直</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图例标记和文本的对齐" prop="align">
        <el-select size="mini" v-model="echartOption.align">
          <el-option value="auto">自动</el-option>
          <el-option value="left">左对齐</el-option>
          <el-option value="right">右对齐</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图例内边距" prop>
        <el-input size="mini" v-model="echartOption.padding"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'legend',
  props: {
    designer: Object,
    selectedWidget: Object
  },
  data() {
    return {}
  },
  computed: {
    echartOption() {
      return this.selectedWidget.options.legend
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.el-form-item {
  margin-bottom: 5px;
}
</style>
