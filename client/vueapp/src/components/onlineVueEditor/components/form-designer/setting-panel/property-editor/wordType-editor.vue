<template>
  <div>
    <el-form-item label="字体选择">
      <el-select v-model="optionModel.fontFamily" filterable allow-create default-first-option>
        <el-option v-for="(fv, fvIdx) in fontFamilyOptions" :key="fvIdx" :label="fv.label" :value="fv.value"> </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="字体选择">
      <div style="display: flex">
        <el-select v-model="optionModel.fontSize" filterable allow-create default-first-option>
          <el-option v-for="(fv, fvIdx) in fontSizeOptions" :key="fvIdx" :label="fv.label" :value="fv.value"> </el-option>
        </el-select>
        <el-color-picker v-model="optionModel.bodyBackground" style="margin-left: 10px"> </el-color-picker>
      </div>
    </el-form-item>
    <el-form-item label="对齐方式">
      <div style="display: flex" class="word-align">
        <div style="margin-right: 10px; width: calc(60% - 10px); cursor: pointer">
          <template v-for="(item, index) in iconList">
            <i :class="[item.icon, optionModel.fontAlign === item.type ? 'active' : '']" @click="clickHandleAlign(item.type, index)" :key="index"></i>
          </template>
        </div>
        <div style="width: 40%; cursor: pointer">
          <template v-for="(item, index) in iconVerticalList">
            <i :class="[item.icon, optionModel.fontPosition === item.type ? 'active' : '']" @click="clickHandle(item.type)" :key="index"></i>
          </template>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="全局设置">
      <el-switch size="mini" v-model="optionModel.wordType.fontGlobal"></el-switch>
    </el-form-item>
  </div>
</template>

<script>
import i18n from '../../../../utils/i18n'

export default {
  name: 'wordType-editor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  data() {
    return {
      fontFamilyOptions: [{ value: 'number', label: '微软雅黑' }],
      fontSizeOptions: [
        { value: '12px', label: '12px' },
        { value: '14px', label: '14px' },
        { value: '16px', label: '16px' },
        { value: '18px', label: '18px' },
        { value: '20px', label: '20px' },
        { value: '22px', label: '22px' }
      ],
      iconList: [
        { icon: 'iconfont-wfmng wfmng-juzuoduiqi1', type: 'left' },
        { icon: 'iconfont-wfmng wfmng-juzhongduiqi', type: 'right' },
        { icon: 'iconfont-wfmng wfmng-juyouduiqi', type: 'center' },
        { icon: 'iconfont-wfmng wfmng-liangduanduiqi', type: 'space-around' }
      ],
      iconVerticalList: [
        { icon: 'iconfont-wfmng wfmng-liangduanduiqi', type: 'top' },
        { icon: 'iconfont-wfmng wfmng-liangduanduiqi', type: 'center' },
        { icon: 'iconfont-wfmng wfmng-liangduanduiqi', type: 'bottom' }
      ]
    }
  },
  mounted() {
    console.log(this.optionModel, 'optionModel')
  },
  methods: {
    clickHandle(value) {
      // console.log(this.optionModel)
      this.$set(this.optionModel, 'fontPosition', value)
      console.log(this.optionModel)
    },
    clickHandleAlign(value) {
      this.$set(this.optionModel, 'fontAlign', value)
      console.log(this.optionModel)
    }
  }
}
</script>

<style lang="scss" scoped>
.word-align {
  & > div {
    background: #ebeef5ff;
    height: 36px;
    line-height: 36px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  i {
    height: 20px;
    width: 20px;
    line-height: 20px;
    &:hover {
      background: #fff;
      color: #409eff;
    }
  }
}
.active {
  background: #fff;
  color: #409eff;
}
</style>
