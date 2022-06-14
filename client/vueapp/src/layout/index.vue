<template>
  <div class="avue-contail">
    <div class="avue-layout">
      <div class="avue-main">
        <div class="avue-left">
          <sidebar />
        </div>
        <div
          style="
            height: calc(100% - 48px);
            overflow-y: auto;
            overflow-x: hidden;
          "
          id="avue-view"
        >
          <router-view class="avue-view" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

// import top from "./top";
import sidebar from "./sidebar";
export default {
  components: {
    // top,
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
#avue-view {
  & > div {
    height: 100%;
  }
}
</style>
