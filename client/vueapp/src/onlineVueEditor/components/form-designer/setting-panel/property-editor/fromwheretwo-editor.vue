<template>
  <div>
    <el-form-item label="值来源" prop="from">
      <el-select
        v-model="optionModel.from"
        class="el-width-p100"
        placeholder="请选择"
      >
        <el-option label="手动输入" value="forminput" />
        <el-option label="系统流水号" value="sequence" />
        <el-option label="脚本" value="scripts" />
        <el-option label="公式" value="formula" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="['sequence'].includes(optionModel.from)"
      label="值"
      prop="sequence"
    >
      <el-select v-model="optionModel['sequence']" class="el-width-p100">
        <el-option
          v-for="item in valueList"
          :key="item.id"
          :label="item.dictValue"
          :value="item.dictKey"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="['scripts'].includes(optionModel.from)"
      label="值"
      prop="scripts"
    >
      <el-input v-model="optionModel.scripts" />
    </el-form-item>
    <el-form-item
      v-if="['forminput'].includes(optionModel.from)"
      label="值"
      prop="scripts"
    >
      <el-input v-model="optionModel.forminput" />
    </el-form-item>
    <el-form-item
      v-if="['formula'].includes(optionModel.from)"
      label="公式"
      prop="scripts"
    >
      <el-input v-model="optionModel.formula" autosize type="textarea" />
      <div style="padding-top: 5px">
        <!-- @click="formulaMethod" -->
        <el-button type="primary" size="small" @click="formulaMethod"
          >公式策略</el-button
        >
      </div>
    </el-form-item>
    <el-form-item
      v-if="['formula'].includes(optionModel.from)"
      label="计算类型"
      prop="computetype"
    >
      <el-select v-model="optionModel.computetype" placeholder="请选择">
        <el-option label="数字" value="number" />
        <el-option label="日期" value="date" />
      </el-select>
    </el-form-item>
    <Formula ref="formula" />
  </div>
</template>

<script>
// import { getBoEntInfo } from '@wfruntime/components/onlineVueEditor/api/biManger'
// import { entitiesOfOneType } from '@wfruntime/components/onlineVueEditor/api/biManger'
import Formula from "../component/formula";
export default {
  // inject: ['parent_this'],
  components: { Formula },

  name: "fromwheretwo-editor",
  data() {
    return { valueList: [], metadataNew: [] };
  },
  mounted() {
    // this.getValue()
    // this.getInDataNew()
  },
  methods: {
    getInDataNew() {
      const formObj = this.parent_this.getFormData(
        this.parent_this.iframeDesignerData
      );
      getBoEntInfo({ ...formObj, flag: false }).then((res) => {
        if (res.code === 200) {
          this.metadataNew = res.data.list;
        }
      });
    },
    formulaMethod() {
      this.$refs.formula.handelOpen(this.metadataNew, this.selectedWidget);
    },
    async getValue() {
      const { data } = await entitiesOfOneType({ type: "NO_BHMC" });
      if (this.callCodeJudge(data.code)) {
        this.valueList = data.data;
      }
    },
  },
  props: {
    designer: Object,
    parentThis: Object,
    optionModel: Object,
    selectedWidget: Object,
  },
  //   props: {
  //   designer: Object,
  //   selectedWidget: Object,
  //   optionModel: Object
  // }
  // }
};
</script>

<style scoped></style>
