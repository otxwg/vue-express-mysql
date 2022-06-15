<template>
  <div><FormItem :item-data="itemData"></FormItem></div>
</template>

<script>
import FormItem from "./formItem.vue";
import { getDesignerList } from "@/api/index";
export default {
  name: "FormLineCustom",
  components: {
    FormItem,
  },
  data() {
    return {
      formModuleList: [],
      itemData: {},
    };
  },
  computed: {},
  watch: {
    $route: {
      deep: true,
      handler(val) {
        this.query();
      },
    },
  },
  created() {},
  mounted() {
    this.query();
  },
  methods: {
    async query() {
      let res = await getDesignerList({});
      const viewId = this.$route.params.id;
      const newData = res.data.data.find((item) => item.viewId === viewId);
      if (newData) {
        this.itemData = {
          html: newData.templateView,
          css: "",
          js: newData.javascript,
        };
      } else {
        this.itemData = {};
      }
    },
  },
};
</script>
<style lang="scss"></style>
