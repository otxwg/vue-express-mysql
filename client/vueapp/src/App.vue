<template>
  <div id="app">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">
        <HelloWorld />
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
        <DesignerList />
      </el-tab-pane>
    </el-tabs> -->
    <router-view></router-view>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import DesignerList from "./components/DesignerList.vue";
export default {
  name: "App",
  components: {
    HelloWorld,
    DesignerList,
  },
  data() {
    return {
      activeName: "second",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
