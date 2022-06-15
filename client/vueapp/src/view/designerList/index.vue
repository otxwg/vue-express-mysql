<template>
  <div class="designer-list">
    <el-form ref="form" label-width="80px" style="display: flex" inline>
      <el-form-item label="名称">
        <el-input v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="age"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="success" @click="dialogVisible = true">新增</el-button>
        <el-button type="warning" @click="update">修改</el-button>
        <el-button type="danger" @click="remote">删除</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- {{ tableData }} -->
    <div v-for="item in tableData">
      <div @click="handleClick(item)">
        <span>{{ item.name }}</span>
        <span>{{ item.key }}</span>
      </div>
    </div>

    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      border
      style="width: 100%"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="key" label="标志" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="_id" label="_id"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="500px">
      <!-- <span>这是一段信息</span> -->
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insert">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDesignerList,
  addDesignerList,
  updateDesignerList,
  removeDesignerList,
} from "@/api/index";
export default {
  name: "DesignerList",
  data() {
    return {
      msg: "",
      name: "",
      age: "",
      _id: 0,
      tableData: [{ name: 0 }],
      multipleSelection: [],
      dialogVisible: false,
      form: {
        name: "",
        key: "",
        type: "",
      },
    };
  },
  created() {
    this.query();
  },
  methods: {
    handleClick(row) {
      // this.$router.push("/vuedesigner");
      this.$router.push({
        path: "/vuedesigner",
        query: { viewId: row.viewId, name: row.name, key: row.key },
      });
    },
    reset() {
      this.name = "";
      this.age = "";
      this.query();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async query() {
      let res = await getDesignerList({
        name: this.name,
        age: this.age,
      });
      // debugger;
      this.tableData = res.data.data;
    },
    async insert() {
      await addDesignerList({
        name: this.form.name,
        key: this.form.key,
      });
      this.query();
    },
    async update() {
      if (!this.multipleSelection.length) {
        this.$message({ type: "warning", message: "请勾选数据" });
        return;
      }
      await updateDesignerList({
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
          await removeDesignerList({
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
.designer-list {
  padding: 16px;
  box-sizing: border-box;
}
h1,
h2 {
  font-weight: normal;
}
</style>
