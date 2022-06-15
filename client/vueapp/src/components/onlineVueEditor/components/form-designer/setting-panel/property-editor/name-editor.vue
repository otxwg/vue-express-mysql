<template>
  <div>
    <el-form-item label="字段名称选择">
      <el-select v-model="optionModel.dbchoose" placeholder="请选择" class="el-width-p100" @change="onChangdict">
        <el-option v-for="item in dictChooseList" :key="item.id" :label="item.dictValue" :value="item.dictKey" />
      </el-select>
    </el-form-item>
    <el-form-item label="字段备注" :rules="commentRequiredRule">
      <el-input type="text" v-model="optionModel.comment"></el-input>
    </el-form-item>
    <el-form-item label="字段标识" :rules="nameRequiredRule">
      <el-input type="text" v-model="optionModel.name" @change="updateWidgetNameAndRef"></el-input>
    </el-form-item>
    <!-- <el-form-item label="字符长度" prop="length">
      <el-input v-model="optionModel.length" />
    </el-form-item>
    <el-form-item label="数据类型" prop="datatype">
      <el-select v-model="optionModel.datatype" placeholder="请选择" class="el-width-p100">
        <el-option label="字符串" value="varchar" />
        <el-option label="数字" value="number" />
        <el-option label="日期" value="date" />
      </el-select>
    </el-form-item> -->
  </div>
</template>

<script>
import i18n from '../../../../utils/i18n'
import { isEmptyStr } from '../../../../utils/util'
import { entitiesOfOneType } from '../../../../api/biManger'
export default {
  name: 'name-editor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  inject: ['serverFieldList'],
  data() {
    return {
      dictChooseList: [],
      nameRequiredRule: [{ required: true, message: '字段标识不能为空' }],
      commentRequiredRule: [{ required: true, message: '字段备注不能为空' }]
    }
  },
  mounted() {
    this.optionModel.length = 50
    this.getDict()
  },
  methods: {
    onChangdict(val) {
      const list = this.dictChooseList.filter((res) => res.dictKey === val)
      if (list[0].remark && list[0].remark !== '') {
        const remark = JSON.parse(list[0].remark)
        for (const i in remark) {
          this.optionModel[i] = remark[i]
        }
      }
    },
    async getDict() {
      const { data } = await entitiesOfOneType({ type: 'formCommonName' })
      this.dictChooseList = data || []
    },
    updateWidgetNameAndRef(newName) {
      let oldName = this.designer.selectedWidgetName
      if (isEmptyStr(newName)) {
        this.selectedWidget.options.name = oldName
        this.$message.info(this.i18nt('designer.hint.nameRequired'))
        return
      }

      if (!!this.designer.formWidget) {
        //检查newName是否已存在！！
        let foundRef = this.designer.formWidget.getWidgetRef(newName)
        if (!!foundRef) {
          this.selectedWidget.options.name = oldName
          this.$message.info(this.i18nt('designer.hint.duplicateName') + newName)
          return
        }

        let fieldWidget = this.designer.formWidget.getWidgetRef(oldName)
        if (!!fieldWidget && !!fieldWidget.registerToRefList) {
          fieldWidget.registerToRefList(oldName) //注册组件新的ref名称并删除老的ref！！
          let newLabel = this.getLabelByFieldName(newName)
          this.designer.updateSelectedWidgetNameAndRef(this.selectedWidget, newName, newLabel)
        }
      }
    },

    getLabelByFieldName(fieldName) {
      for (let i = 0; i < this.serverFieldList.length; i++) {
        if (this.serverFieldList[i].name === fieldName) {
          return this.serverFieldList[i].label
        }
      }

      return null
    }
  }
}
</script>

<style lang="scss" scoped></style>
