<template>
  <div
    class="field-wrapper"
    @click.stop="clickGdTable"
    :class="[selected ? 'selected' : '']"
  >
    <gd-echart
      :width="'100%'"
      :height="widget.options.echartHeight"
      :options="options"
    >
    </gd-echart>
    <template v-if="!!this.designer">
      <div class="field-action" v-if="designer.selectedId === field.id">
        <i
          class="el-icon-back"
          :title="i18nt('designer.hint.selectParentWidget')"
          @click.stop="selectParentWidget(field)"
        ></i>
        <i
          class="el-icon-delete"
          :title="i18nt('designer.hint.remove')"
          @click.stop="removeFieldWidget"
        ></i>
      </div>

      <div
        class="drag-handler background-opacity"
        v-if="designer.selectedId === field.id"
      >
        <i class="el-icon-rank" :title="i18nt('designer.hint.dragHandler')"></i>
        <i>{{
          i18n2t(
            `designer.widgetLabel.${field.type}`,
            `extension.widgetLabel.${field.type}`
          )
        }}</i>
        <i v-if="field.options.hidden === true" class="iconfont icon-hide"></i>
      </div>
    </template>
  </div>
</template>

<script>
import i18n from "../../../../utils/i18n";
// import { default as request, getDesignerUrl } from '@wfruntime/util/request'
import request from "../../../../../axios";
const Qs = require("qs");
export default {
  name: "gdEchart-widget",
  components: {},
  mixins: [i18n],
  data() {
    return {
      border: true,
      stripe: false,
      tableDataFormLine: [],
    };
  },
  props: {
    field: Object,
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
  },
  computed: {
    selected() {
      return !!this.designer && this.field.id === this.designer.selectedId;
    },
    options() {
      return JSON.parse(this.widget.options.echartOption);
    },
  },
  mounted() {},
  methods: {
    async getTableList() {
      const params = JSON.parse(this.widget.options.tableConfig.config4);
      const backType = this.widget.options.tableConfig.config5;
      const requestType = this.widget.options.tableConfig.method;

      let newData = {};
      if (requestType === "post") {
        // newData = await request({
        //   url: getDesignerUrl() + this.widget.options.tableConfig.url,
        //   method: "post",
        //   data: Qs.stringify(params),
        // });
      } else {
        newData = await request({
          // url: getDesignerUrl() + this.widget.options.tableConfig.url,
          // method: "get",
          // params: {
          //   ...params,
          // },
        });
      }

      const resetMethed = eval(
        `(${this.widget.options.tableConfig.configMethod})`
      );
      this.tableDataFormLine = resetMethed(
        backType === "" ? newData : newData[backType]
      );
    },
    selectParentWidget() {
      if (this.parentWidget) {
        this.designer.setSelected(this.parentWidget);
      } else {
        this.designer.clearSelected();
      }
    },
    removeFieldWidget() {
      if (!!this.parentList) {
        let nextSelected = null;
        if (this.parentList.length === 1) {
          if (!!this.parentWidget) {
            nextSelected = this.parentWidget;
          }
        } else if (this.parentList.length === 1 + this.indexOfParentList) {
          nextSelected = this.parentList[this.indexOfParentList - 1];
        } else {
          nextSelected = this.parentList[this.indexOfParentList + 1];
        }

        this.$nextTick(() => {
          this.parentList.splice(this.indexOfParentList, 1);
          //if (!!nextSelected) {
          this.designer.setSelected(nextSelected);
          //}

          this.designer.emitHistoryChange();
        });
      }
    },
    clickGdTable() {
      this.designer.setSelected(this.widget);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../../styles/global.scss";

.design-time-bottom-margin {
  margin-bottom: 0px;
}

.field-wrapper {
  position: relative;
  .field-action {
    position: absolute;
    //bottom: -24px;
    bottom: 0;
    right: -2px;
    height: 22px;
    line-height: 22px;
    background: $--color-primary;
    z-index: 9;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
    }
  }

  .drag-handler {
    position: absolute;
    top: 0;
    //bottom: -22px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
    left: 50%;
    height: 20px;
    line-height: 20px;
    background: $--color-primary;
    z-index: 9;

    i {
      font-size: 12px;
      font-style: normal;
      color: #fff;
      margin: 4px;
      cursor: move;
    }

    &:hover {
      //opacity: 1;
      background: $--color-primary;
    }
  }
}
.selected {
  outline: 2px solid $--color-primary;
}
</style>
