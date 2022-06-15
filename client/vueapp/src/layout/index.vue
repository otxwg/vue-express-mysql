<template>
  <div class="avue-warp">
    <div class="avue-left">
      <sidebar />
    </div>
    <div class="avue-main">
      <router-view class="avue-view" />
    </div>
  </div>
</template>

<script>
import sidebar from "./sidebar";
export default {
  components: {
    sidebar,
  },
  provide() {
    return {};
  },
  data() {
    return {
      // 搜索控制
      isSearch: false,
    };
  },
  created() {},
  mounted() {},
  computed: {},
  props: [],
  methods: {
    showCollapse() {},
  },
};
</script>
<style lang="scss" scoped>
.avue-warp {
  height: 100%;
  display: flex;
  .avue-left {
    height: 100%;
    width: 300px;
  }
  .avue-main {
    height: 100%;
    position: absolute;
    left: 300px;
    top: 0;
    width: calc(100% - 300px);
  }
}
</style>
