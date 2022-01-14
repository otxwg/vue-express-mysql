<template>
  <div>
    <el-form ref="form" label-width="80px" style="display: flex" inline>
      <el-form-item label="名称">
        <el-input v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="age"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="success" @click="insert">新增</el-button>
        <el-button type="warning" @click="update">修改</el-button>
        <el-button type="danger" @click="remote">删除</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      border
      style="width: 100%"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="age" label="年龄" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="_id" label="_id"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, addList, updateList, removeList } from "../api/index";
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "",
      name: "",
      age: "",
      _id: 0,
      tableData: [],
      multipleSelection: [],
    };
  },
  created() {
    this.query();
  },
  methods: {
    reset() {
      this.name = "";
      this.age = "";
      this.query();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async query() {
      let res = await getList({
        name: this.name,
        age: this.age,
      });
      this.tableData = res.data.data;
    },
    async insert() {
      await addList({
        name: this.name,
        age: this.age,
      });
      this.query();
    },
    async update() {
      if (!this.multipleSelection.length) {
        this.$message({ type: "warning", message: "请勾选数据" });
        return;
      }
      await updateList({
        _id: this.multipleSelection[0] && this.multipleSelection[0]._id,
        name: this.name,
        age: this.age,
      });
      this.query();
    },
    async remote() {
      if (!this.multipleSelection.length) {
        this.$message({ type: "warning", message: "请勾选数据" });
        return;
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await removeList({
            _id: this.multipleSelection[0] && this.multipleSelection[0]._id,
          });
          await this.query();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style scoped>
h1,
h2 {
  font-weight: normal;
}
</style>
