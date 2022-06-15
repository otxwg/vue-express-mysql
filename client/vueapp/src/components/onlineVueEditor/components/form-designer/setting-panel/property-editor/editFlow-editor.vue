<template>
  <div>
    <el-form-item label="可编辑环节" prop="activities">
      <gd-selectTree
        ref="selectTree"
        size="mini"
        :cur-value="activities"
        :data="allDefWithNodeData"
        :obj="{
          id: 'activityId',
          label: 'name',
          pid: 'pKey',
          children: 'activityNodeList',
        }"
        multiple
        check-strictly
        clearable
        filterable
        collapse-tags
        @getValue="onGetValueActivities"
      />
    </el-form-item>
    <el-form-item label="可编辑角色" prop="roles">
      <el-cascader
        size="mini"
        v-model="optionModel.roles"
        :options="roleTreeData"
        :props="{
          label: 'roleName',
          multiple: true,
          value: 'id',
          emitPath: false,
          children: 'menuVOList',
        }"
        placeholder="请输入"
        collapse-tags
        clearable
        class="el-width-p100"
      />
    </el-form-item>
    <el-form-item label="可编辑岗位" prop="pos">
      <el-select
        v-model="optionModel.pos"
        multiple
        collapse-tags
        clearable
        class="el-width-p100"
        size="mini"
      >
        <el-option
          v-for="item in jobListData"
          :key="item.id"
          :value="item.id"
          :label="item.postName"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="可编辑机构" prop="orgid">
      <el-cascader
        v-model="optionModel.orgid"
        :options="userTreeDataUnit"
        size="mini"
        :props="{ multiple: true, value: 'id', label: 'name', emitPath: false }"
        placeholder="机构"
        collapse-tags
        style="width: 100%"
        clearable
      />
    </el-form-item>
  </div>
</template>

<script>
// import { listUnitAndUser, listRoleTree, getList, getFindAllDefWithNode } from '@wfruntime/components/onlineVueEditor/api/form'
export default {
  name: "editFlow-editor",
  data() {
    return {
      pos: [],
      validationList: [],
      activities: [],
      roles: [],
      orgid: [],
      allDefWithNodeData: [],
      roleTreeData: [],
      jobListData: [],
      userTreeDataUnit: [],
    };
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  mounted() {
    // // 角色
    // this.getRoleTreeData()
    // // 岗位
    // this.getJobList()
    // // 机构
    // this.listUnitAndUser()
    // // 可编辑环节
    // this.getFindAllDefWithNodeData()
  },
  methods: {
    onGetValueActivities(row) {
      this.$set(this.optionModel, "activities", row);
    },
    // 可编辑环节后台数据
    async getFindAllDefWithNodeData() {
      const { code, data } = await getFindAllDefWithNode();
      if (this.callCodeJudge(code)) {
        this.allDefWithNodeData = data.map((item, index) => {
          item["name"] = item.subject;
          item["activityId"] = index + 1000 + "activity";
          item["disabled"] = true;
          if (item["activityNodeList"] && item["activityNodeList"].length) {
            item["activityNodeList"].forEach((y) => {
              y["pKey"] = item.key;
            });
          }
          return item;
        });
      }
    },
    // 可编辑角色数据
    async getRoleTreeData() {
      const { code, data } = await listRoleTree({ showCurApp: false });
      if (this.callCodeJudge(code)) {
        this.roleTreeData = this.setTableChildren(data, "menuVOList");
      }
    },
    // 岗位人员
    async getJobList() {
      const params = {};
      params[this.configGlo.page] = 1;
      params[this.configGlo.size] = 1000;
      const { data } = await getList(params);
      if (this.callCodeJudge(data.code)) {
        this.jobListData = data.data.data;
      }
    },
    // 获取人员机构树
    async listUnitAndUser() {
      const { code, data } = await listUnitAndUser();
      if (this.callCodeJudge(code)) {
        this.unitList = data[0];
        this.userTreeDataUnit = this.onlyPepole(this.onlyOrg(data[0]));
      }
    },
    onlyPepole(data) {
      data.forEach((res) => {
        res.valueId = res.pd.id;
        if (res.children && res.children.length !== 0) {
          return this.onlyPepole(res.children);
        }
        delete res.children;
      });
      return data;
    },
    onlyOrg(data) {
      return data
        .map((item) => {
          if (item.children) {
            if (item.children.length > 0 || item.type === "org") {
              return {
                id: item.id,
                showOrg: true,
                name: item.name,
                checked: item.checked,
                pId: item.pId,
                pd: item.pd,
                type: item.type,
                children: this.onlyOrg(item.children),
              };
            }
          }
        })
        .filter((res) => res !== undefined);
    },
    // 修改children ARRAY类型为null 或者undefined
    setTableChildren(data, child, isUpdate) {
      child = child || "children";
      data.forEach((res) => {
        if (res[child] && res[child].length) {
          return this.setTableChildren(res[child]);
        } else {
          res["disabled"] = false;
          if (isUpdate) {
            if (res.type !== "user") {
              res["disabled"] = true;
            }
          }
          res[child] = null;
        }
      });
      return data;
    },
  },
};
</script>

<style scoped></style>
