<template>
  <div class="avue-sidebar" :style="style">
    <el-scrollbar style="height: 100%">
      <div v-if="!menu.length" class="avue-sidebar--tip">没有发现菜单</div>
      <el-menu
        :default-active="defalutTagValue"
        :show-timeout="200"
        :collapse="ifSideBar"
        unique-opened
        mode="vertical"
      >
        <sidebar-item
          :menu="menu"
          :init-tag-value="defalutTagValue"
          :props="menuProps"
          :collapse="ifSideBar"
          first
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import sidebarItem from "./sidebarItem";
import { getDesignerList } from "@/api/index";
export default {
  name: "Sidebar",
  components: { sidebarItem },
  data() {
    return {
      defalutTagValue: "/DesignerList",
      menuProps: {
        label: "menuName",
        path: "path",
        icon: "source",
        children: "children",
      },
      menu: [
        { menuName: "表单定制", path: "/" },
        // { menuName: "菜单", path: "/render" },
      ],
    };
  },
  created() {
    this.query();
  },
  computed: {
    ifSideBar() {
      return false;
    },
    style() {
      return {};
    },
  },
  watch: {
    $route(to, from) {
      if (to.path === "/") {
        this.$router.push("/DesignerList");
      }
      if (to.meta.isDetail) {
        return;
      }
      this.defalutTagValue = to.path;
    },
  },
  mounted() {
    this.defalutTagValue = this.getDefalutTagValue();
  },
  methods: {
    async query() {
      let res = await getDesignerList({
        name: this.name,
        age: this.age,
      });
      this.tableData = res.data.data.map((item) => {
        item.path = `/render/${item.viewId}`;
        item.menuName = item.name;
        return item;
      });
      this.menu = [...this.menu, ...this.tableData];
    },
    getDefalutTagValue() {
      if (this.$route.path !== "/") {
        return this.$route.path;
      }
      if (this.menu.length !== 0) {
        let paths = "";
        if (this.menu[0].children.length !== 0) {
          paths = this.menu[0].children[0].path;
        } else {
          paths = this.menu[0].path;
        }
        return paths;
      } else {
        return "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.avue-sidebar {
  width: 300px;
}
</style>
