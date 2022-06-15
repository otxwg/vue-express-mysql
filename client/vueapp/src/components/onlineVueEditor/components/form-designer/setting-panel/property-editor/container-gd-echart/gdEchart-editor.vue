<template>
  <div>
    <el-form-item :label="'高度'">
      <el-input type="text" v-model="optionModel.echartHeight"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import i18n from '../../../../../utils/i18n'
import CodeEditor from '../../../../code-editor/index'
import { genVueData } from '../../../../../utils/vue2js-generator'
export default {
  name: 'gdEchart-editor',
  components: { CodeEditor },
  mixins: [i18n],
  data() {
    return {
      visibleDraw: false,
      maximized: false,
      showDialog: false,
      showDialogMethod: false,
      showDialogTable: false,
      options2: [],
      optionsStatic: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      options6: [
        {
          value: 'data',
          label: 'data'
        },
        {
          value: 'data.records',
          label: 'data.records'
        }
      ],
      optionsMethod: [
        {
          value: 'post',
          label: 'post'
        },
        {
          value: 'get',
          label: 'get'
        }
      ]
    }
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  mounted() {
    // this.getParamsList()
  },
  methods: {
    getParamsList() {
      const formData = genVueData(this.designer.formConfig, this.designer.widgetList)
      this.options2 = formData.map((res) => {
        const arr = res.split(':')
        return {
          value: arr[0],
          label: arr[0]
        }
      })
    },
    dialogMethod() {
      this.$refs.addColumn.showDialog = true
    },
    onSubmit() {}
  }
}
</script>

<style scoped></style>
