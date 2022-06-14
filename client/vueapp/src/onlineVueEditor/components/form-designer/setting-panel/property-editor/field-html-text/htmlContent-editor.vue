<template>
  <div>
    <el-form-item :label="i18nt('designer.setting.htmlContent')">
      <el-button type="primary" size="small" @click="codeEdit(optionModel.htmlContent)">代码编写</el-button>
      <!-- <el-input v-model="optionModel.htmlContent"></el-input> -->
    </el-form-item>
    <BtnDrawer ref="btnDrawer" :generate-conf="generateConf" size="100%" @saveCodeData="saveCodeData" @closedPreview="closedPreview" />
  </div>
</template>

<script>
import i18n from '../../../../../utils/i18n'
const BtnDrawer = () => import('gd_vue_components/src/components_others/gd_form_design/src/views/index/BtnDrawer')
export default {
  name: 'htmlContent-editor',
  components: { BtnDrawer },
  data() {
    return {
      generateConf: { fileName: '', type: 'file' }
    }
  },
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  methods: {
    saveCodeData({ htmlCode, jsCode, cssCode, otherJsCode }) {
      this.$set(this.optionModel.htmlContent, 'compJavascript', jsCode)
      this.$set(this.optionModel.htmlContent, 'compCss', cssCode)
      this.$set(this.optionModel.htmlContent, 'compView', htmlCode)
    },
    closedPreview() {},
    // 代码编辑
    codeEdit(row, index) {
      this.$refs.btnDrawer.onOpen(
        { compJavascript: row.compJavascript ? row.compJavascript + '#code#' : '', compView: row.compView || '<div>自定义控件</div>', compCss: row.compCss || '' },
        false
      )
    }
  }
}
</script>

<style scoped></style>
