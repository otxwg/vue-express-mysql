<template>
  <div>999<FormItem :item-data="itemData"></FormItem></div>
</template>

<script>
// import { getAllForms, getEditData } from '@wfmng/api/vuedesigner'
import FormItem from "./formItem.vue";
import { getDesignerList } from "../../api/index";
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
        console.log(this.$route, "this.$route");
        this.query();
        // this.allforms(val);
      },
    },
  },
  created() {},
  mounted() {
    // this.getTemplate(this.$route)
    // this.allforms(this.$route);
    console.log(this.$route, "this.$route");
    this.query();
  },
  methods: {
    // async allforms(val) {
    //   const params = {
    //     current: 1,
    //     size: 1000,
    //     keywords: "",
    //     typeCode: -1,
    //     Q_NAME__S_LK: "",
    //     equipmentType: "",
    //   };
    //   // debugger
    //   // var resData = await getAllForms(params)
    //   // const vueList = resData.data.records.filter((res) => res.type === 'ONLINE-VUE-DEV' && res.key === val.meta.code)

    //   if (vueList.length > 0) {
    //     const data = await getEditData({
    //       pkId: vueList[0].viewId,
    //       forCopy: "",
    //     });
    //     const newData = data?.data?.bpmFormView || {};
    //     this.itemData = {
    //       html: newData.templateView,
    //       css: "",
    //       js: newData.javascript,
    //     };
    //   } else {
    //     this.itemData = {};
    //   }
    //   console.log(vueList, "vueListvueList");
    // },
    async query() {
      let res = await getDesignerList({});
      console.log(res.data.data, "res");
      const viewId = this.$route.params.id;
      console.log(viewId, "viewId");
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

      // this.tableData = res.data.data.map((item) => {
      //   item.path = `/render?${item.viewId}`;
      //   item.menuName = item.name;
      //   return item;
      // });
      // this.menu = [...this.menu, ...this.tableData];
    },
  },
};
</script>
<style lang="scss"></style>
