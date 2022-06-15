<template>
  <div class="menu-wrapper">
    <template v-for="item in menu">
      <el-menu-item
        :index="item['path']"
        @click="open(item)"
        :key="item['menuName']"
      >
        <i :class="item['icon']"></i>
        <span slot="title" :alt="item['path']">{{ generateTitle(item) }}</span>
      </el-menu-item>
      <el-submenu
        v-if="!validatenull(item['children'])"
        :index="item['path'] === '' ? item['menuName'] : item['path']"
        :key="item['menuName']"
      >
        <template slot="title">
          <i :class="item['icon']"></i>
          <span
            slot="title"
            :class="{ 'el-menu--display': collapse && first }"
            >{{ generateTitle(item) }}</span
          >
        </template>
        <template v-for="(child, cindex) in item['children']">
          <el-menu-item
            :index="child['path'] || cindex"
            @click="open(child)"
            v-if="validatenull(child['children'])"
            :key="child['menuName']"
            :class="{ 'is-active': vaildAvtive(child) }"
          >
            <i :class="child['icon']"></i>
            <span slot="title">{{ generateTitle(child) }}</span>
          </el-menu-item>
          <sidebar-item
            v-else
            :menu="[child]"
            :key="cindex"
            :props="props"
            :screen="screen"
            :collapse="collapse"
          ></sidebar-item>
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
export default {
  name: "sidebarItem",
  data() {
    return {};
  },
  props: {
    menu: {
      type: Array,
    },
    screen: {
      type: Number,
    },
    first: {
      type: Boolean,
      default: false,
    },
    initTagValue: {
      type: String,
      default: "",
    },
    props: {
      type: Object,
      default: () => {
        return {};
      },
    },
    collapse: {
      type: Boolean,
    },
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    generateTitle(item) {
      return item.menuName;
    },
    vaildAvtive(item) {
      const groupFlag = (item["group"] || []).some((ele) =>
        this.$route.path.includes(ele)
      );
      return this.initTagValue === item["path"] || groupFlag;
    },
    vaildRoles(item) {
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
    },

    /**
     * 判断是否为空
     */
    validatenull(val) {
      if (typeof val === "boolean") {
        return false;
      }
      if (typeof val === "number") {
        return false;
      }
      if (val instanceof Array) {
        if (val.length == 0) return true;
      } else if (val instanceof Object) {
        if (JSON.stringify(val) === "{}") return true;
      } else {
        if (
          val == "null" ||
          val == null ||
          val == "undefined" ||
          val == undefined ||
          val == ""
        ) {
          return true;
        }
        return false;
      }
      return false;
    },
    open(item) {
      // 命名的路由
      this.$router.push({ name: "render", params: { id: item.viewId } });
    },
  },
};
</script>
