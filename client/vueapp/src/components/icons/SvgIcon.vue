<template>
  <span>
    <i
      v-if="isIconFont || isElIcon"
      :class="
        isElIcon
          ? iconName
          : `iconfont-${iconSuffix} ${cssPrefixText}${iconName}`
      "
      :style="IconClass"
    />
    <!-- 处理导航栏菜单配置iconfont -->
    <!-- <i v-else-if="iconName.includes('iconfont-')" :class="iconName" :style="IconClass" class="top_menuSvgicon" /> -->
    <svg
      v-else
      :class="svgClass"
      :style="iconStyle"
      aria-hidden="true"
      v-on="$listeners"
    >
      <use
        :xlink:href="
          !isLocalSvg ? `#${cssPrefixText}${iconName}` : `#${iconName}`
        "
      />
    </svg>
  </span>
</template>

<script>
import svgNameList from "./index";
export default {
  name: "SvgIcon",
  props: {
    setIconClass: {
      type: Object,
      default: () => {},
    },
    iconSuffix: {
      // iconfont的图标库名称
      // 比如iconfont-hainan,取值hainan
      type: String,
      default: "",
    },
    cssPrefixText: {
      // iconfont的图标库名称
      // 比如iconfont-hainan,取值hainan
      type: String,
      default: "",
    },
    iconClass: {
      type: String,
      required: true,
    },
    iconStyle: {
      type: Object,
      default: () => {
        return {};
      },
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    IconClass() {
      if (this.iconClass.includes("[")) {
        return {
          color: this.iconClass.match(/\[(\S*)\]/)[1],
          ...this.setIconClass,
        };
      } else {
        return this.setIconClass;
      }
    },
    isIconFont() {
      return (
        this.iconClass.includes("[") || this.iconClass.includes("iconfont")
      );
    },
    iconName() {
      if (this.iconClass.includes("[")) {
        return this.iconClass.match(/(\S*)\[/)[1];
        // this.setIconClass = this.iconClass.match(/\[(\S*)\]/)[1]
        // iconName = `iconfont ${iconClass}${setIcon}`
      } else {
        return this.iconClass;
      }
    },
    isLocalSvg() {
      const localArr = svgNameList.filter((res) => res.name === this.iconName);
      return localArr.length > 0;
    },
    isElIcon() {
      return this.iconClass.includes("el-icon");
    },
    svgClass() {
      return "svg-icon";
    },
  },
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.top_menuSvgicon {
  font-size: 24px;
  line-height: 24px;
  margin-bottom: 5px;
}
</style>
