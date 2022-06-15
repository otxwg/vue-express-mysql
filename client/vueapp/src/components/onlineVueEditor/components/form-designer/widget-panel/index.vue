<template>
  <div class="panel-container">
    <el-tabs v-model="firstTab" class="no-bottom-margin indent-left-margin">
      <el-tab-pane name="componentLib" class="my-el-tab-pane">
        <span slot="label"> {{ i18nt("designer.componentLib") }}</span>
        <el-collapse v-model="activeNames" class="widget-collapse">
          <el-collapse-item name="1" :title="i18nt('designer.containerTitle')">
            <draggable
              tag="ul"
              :list="containers"
              :group="{ name: 'dragGroup', pull: 'clone', put: false }"
              :clone="handleContainerWidgetClone"
              ghost-class="ghost"
              :sort="false"
              :move="checkContainerMove"
              @end="onContainerDragEnd"
            >
              <li
                v-show="ctn.type !== 'gdEchart'"
                v-for="(ctn, index) in containers"
                :key="index"
                :class="[
                  'container-widget-item',
                  index % 2 === 0 && index === containers.length - 1
                    ? 'container-widget-item-last'
                    : '',
                ]"
                :title="ctn.displayName"
                @dblclick="addContainerByDbClick(ctn)"
              >
                <el-popover
                  v-if="ctn.type === 'table'"
                  placement="right"
                  trigger="hover"
                >
                  <div class="table_span">
                    <span
                      v-for="(item, index) in 100"
                      :key="index"
                      :class="
                        activeIndex >= index && setActiveNum(activeIndex, index)
                          ? 'span_class spanActive'
                          : 'span_class'
                      "
                      @mouseover="hoverMethod('mouseover', index)"
                      @mouseleave="hoverMethod('mouseleave')"
                      @click="tableSpanMethod(ctn)"
                    >
                    </span>
                  </div>
                  <span slot="reference" class="item_span" style="">
                    <!-- <svg-icon :icon-class="ctn.icon" icon-type="svg"></svg-icon> -->
                    <img
                      :src="require(`../../../icons/svg/${ctn.icon}.svg`)"
                      alt=""
                    />
                    {{
                      i18n2t(
                        `designer.widgetLabel.${ctn.type}`,
                        `extension.widgetLabel.${ctn.type}`
                      )
                    }}</span
                  >
                </el-popover>
                <span v-else class="item_span">
                  <!-- <svg-icon :icon-class="ctn.icon" icon-type="svg"></svg-icon> -->
                  <img
                    :src="require(`../../../icons/svg/${ctn.icon}.svg`)"
                    alt=""
                  />
                  {{
                    i18n2t(
                      `designer.widgetLabel.${ctn.type}`,
                      `extension.widgetLabel.${ctn.type}`
                    )
                  }}</span
                >
              </li>
            </draggable>
          </el-collapse-item>
          <el-collapse-item name="10" :title="i18nt('designer.echartTitle')">
            <!-- <el-button type="primary" size="small" @click="openEchart">大屏</el-button> -->
            <draggable
              tag="ul"
              :list="containersEchart"
              :group="{ name: 'dragGroup', pull: 'clone', put: false }"
              :clone="handleContainerWidgetClone"
              ghost-class="ghost"
              :sort="false"
              :move="checkContainerMove"
              @end="onContainerDragEnd"
            >
              <li
                v-for="(ctn, index) in containersEchart"
                :key="index"
                :class="[
                  'container-widget-item',
                  index % 2 === 0 && index === containersEchart.length - 1
                    ? 'container-widget-item-last'
                    : '',
                ]"
                :title="ctn.displayName"
                @dblclick="addContainerByDbClick(ctn)"
              >
                <span class="item_span item_span_img">
                  <img
                    :src="require(`../../../icons/svg/${ctn.icon}.svg`)"
                    alt=""
                  />
                  {{ ctn.echartName }}</span
                >
              </li>
            </draggable>
          </el-collapse-item>
          <el-collapse-item name="2" :title="i18nt('designer.basicFieldTitle')">
            <draggable
              tag="ul"
              :list="basicFields"
              :group="{ name: 'dragGroup', pull: 'clone', put: false }"
              :clone="handleFieldWidgetClone"
              ghost-class="ghost"
              :sort="false"
            >
              <li
                v-for="(fld, index) in basicFields"
                :key="index"
                :class="[
                  'container-widget-item',
                  index % 2 === 0 && index === basicFields.length - 1
                    ? 'container-widget-item-last'
                    : '',
                ]"
                :title="fld.displayName"
                @dblclick="addFieldByDbClick(fld)"
              >
                <span class="item_span">
                  <img
                    :src="require(`../../../icons/svg/${fld.icon}.svg`)"
                    alt=""
                  />

                  {{
                    i18n2t(
                      `designer.widgetLabel.${fld.type}`,
                      `extension.widgetLabel.${fld.type}`
                    )
                  }}</span
                >
              </li>
            </draggable>
          </el-collapse-item>

          <el-collapse-item
            name="3"
            :title="i18nt('designer.advancedFieldTitle')"
          >
            <draggable
              tag="ul"
              :list="advancedFields"
              :group="{ name: 'dragGroup', pull: 'clone', put: false }"
              :clone="handleFieldWidgetClone"
              ghost-class="ghost"
              :sort="false"
            >
              <li
                v-for="(fld, index) in advancedFields"
                :key="index"
                :class="[
                  'container-widget-item',
                  index % 2 === 0 && index === advancedFields.length - 1
                    ? 'container-widget-item-last'
                    : '',
                ]"
                :title="fld.displayName"
                @dblclick="addFieldByDbClick(fld)"
              >
                <span class="item_span">
                  <img
                    :src="require(`../../../icons/svg/${fld.icon}.svg`)"
                    alt=""
                  />
                  {{
                    i18n2t(
                      `designer.widgetLabel.${fld.type}`,
                      `extension.widgetLabel.${fld.type}`
                    )
                  }}</span
                >
              </li>
            </draggable>
          </el-collapse-item>

          <el-collapse-item
            name="4"
            :title="i18nt('designer.customFieldTitle')"
            class="last-el-collapse-item"
          >
            <el-tree
              :data="dataTree"
              :props="defaultProps"
              node-key="id"
              default-expand-all
              @node-click="executeSql"
            >
              <span
                slot-scope="{ data }"
                class="custom-tree-node modulemng-custom-tree-node"
                style="justify-content: left"
              >
                <!-- <svg-icon v-if="data.typeCode === 'searchdefData'" :icon-class="'dbziduan'" style="margin: 0 5px" /> -->
                <!-- <svg-icon v-else :icon-class="'el-icon-folder'" style="margin: 0 5px" /> -->
                <img
                  v-if="data.typeCode === 'searchdefData'"
                  :src="require(`../../../icons/svg/BI_文本.svg`)"
                  alt=""
                />
                <img
                  v-else
                  :src="require(`../../../icons/svg/文件夹.svg`)"
                  alt=""
                />
                <span title="右键跳转编辑" style="margin: 0 5px">{{
                  data.typeName
                }}</span>
              </span>
            </el-tree>
          </el-collapse-item>
          <!-- -->
        </el-collapse>
      </el-tab-pane>

      <el-tab-pane name="formLib" class="my-el-tab-pane">
        <span slot="label"> {{ i18nt("designer.formLib") }}</span>
        <div style="height: 100%; overflow: auto; padding: 16px">
          <template v-for="(ft, idx) in formModuleList">
            <el-card
              :bord-style="{ padding: '0' }"
              shadow="hover"
              class="ft-card"
              :key="idx"
            >
              <div class="bottom">
                <div class="ft-title">{{ ft.compValue }}表单模板名称</div>
                <div class="ft-warp" style="">
                  <el-button
                    type="text"
                    style="margin-right: 16px"
                    class="left-button"
                    @click="loadFormTemplate(ft.compJavascript, ft)"
                  >
                    <img
                      :src="require(`../../../icons/svg/加载模板.svg`)"
                      alt=""
                    />
                    {{ i18nt("designer.hint.loadFormTemplate") }}</el-button
                  >
                  <el-popover
                    class="right-button"
                    placement="right"
                    trigger="click"
                    width="600px"
                  >
                    <el-button type="text" slot="reference"
                      ><i
                        class="el-icon-view"
                        style="margin-right: 4px; font-size: 16px"
                      ></i
                      >查看效果图</el-button
                    >
                    <div style="width: 1000px">
                      <Test :item-data="itemData(ft.compView)"></Test>
                    </div>
                  </el-popover>
                </div>
              </div>
            </el-card>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import {
  containers,
  containersEchart,
  basicFields,
  advancedFields,
  customFields,
} from "./widgetsConfig";
import { formTemplates } from "./templatesConfig";
// import { addWindowResizeHandler } from '../../../utils/util'
import i18n from "../../../utils/i18n";
// import { getTreeTypeAndSearchDef, iniSearch } from '../../../api/biManger'
import ftImg1 from "../../../assets/ft-images/t1.png";
import ftImg2 from "../../../assets/ft-images/t2.png";
import ftImg3 from "../../../assets/ft-images/t3.png";
import ftImg4 from "../../../assets/ft-images/t4.png";
import ftImg5 from "../../../assets/ft-images/t5.png";
import ftImg6 from "../../../assets/ft-images/t6.png";
import ftImg7 from "../../../assets/ft-images/t7.png";
import ftImg8 from "../../../assets/ft-images/t8.png";
import Test from "../toolbar-panel/test.vue";

// import EchartDraw from '../../echart'
export default {
  name: "FieldPanel",
  mixins: [i18n],
  components: {
    Draggable,
    Test,
    // EchartDraw
  },
  props: {
    designer: Object,
    formModuleList: {
      type: Array,
      default: () => [],
    },
  },
  inject: ["getBannedWidgets", "getDesignerConfig"],
  data() {
    return {
      activeIndex: -2,
      defaultProps: {
        children: "children",
        label: "typeName",
      },
      dataTree: [],
      designerConfig: this.getDesignerConfig(),
      formConfig: {
        modelName: "formData",
        refName: "vForm",
        rulesName: "rules",
        labelWidth: 80,
        labelPosition: "left",
        size: "",
        labelAlign: "left",
        cssCode: "",
        customClass: "",
        functions: "",
        layoutType: "PC",
        onFormCreated: "",
        onFormMounted: "",
        onFormDataChange: "",
      },
      firstTab: "componentLib",

      scrollerHeight: 0,

      activeNames: ["1", "2", "3", "4"],
      containersEchart,
      containers,
      basicFields,
      advancedFields,
      customFields,

      formTemplates: formTemplates,
      ftImages: [
        { imgUrl: ftImg1 },
        { imgUrl: ftImg2 },
        { imgUrl: ftImg3 },
        { imgUrl: ftImg4 },
        { imgUrl: ftImg5 },
        { imgUrl: ftImg6 },
        { imgUrl: ftImg7 },
        { imgUrl: ftImg8 },
      ],
    };
  },
  computed: {
    itemData() {
      return (compView) => {
        try {
          return JSON.parse(compView);
        } catch (error) {
          console.log(compView, "***");
          return {};
        }
      };
    },
  },
  mounted() {
    this.loadWidgets();
    // this.getTreeTypeAndSearchDef()
  },
  methods: {
    setActiveNum(num, indexNum) {
      const arrActive = num.toString().charAt(num.toString().length - 1);
      const arrIndex = indexNum
        .toString()
        .charAt(indexNum.toString().length - 1);
      return parseInt(arrActive) >= parseInt(arrIndex);
    },
    hoverMethod(type, index) {
      if (type === "mouseover") {
        this.activeIndex = index;
      } else {
        this.activeIndex = -2;
      }
    },
    // openEchart() {
    //   this.$refs.openEchart.showEchart = true
    // },
    // 获取参数
    async executeSql(row) {
      if (row.typeCode !== "searchdefData") {
        return;
      }
      this.$confirm("是否加载此表?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.iniSelSearch(row.id);
      });
    },
    async iniSelSearch(rowId) {
      const paramsData = {
        id: rowId,
      };
      const retConfig = await iniSearch(paramsData);

      if (retConfig.success) {
        const columns = retConfig.data.aSearch.retcolumns;
        const columnsView = this.getCoumns({ data: columns });
        const whereField = retConfig.data.aSearch.conditions;
        const toolList = retConfig.data.aSearch.tools.filter(
          (el) => el.resType !== "page"
        );
        const toolColumn = (retConfig.data.aSearch.rowOperations || []).filter(
          (i) => {
            if (i.config && this.isJsonString(i.config)) {
              i.config = JSON.parse(i.config);
            } else {
              i.config = {};
            }
            return !["page"].includes(i.resType);
          }
        );
        const isTextBtn = toolColumn.filter(
          (i) => i.config?.type !== "text"
        ).length;
        // 字符14px 150基础宽度
        const columnWidth =
          120 +
          toolColumn.map((i) => i.resChname).join("").length * 16 +
          toolColumn.length * 26 +
          isTextBtn * 40;
        const actionColumn = {
          label: "操作",
          prop: "custom_handle_column",
          // fixed: 'right',
          align: "center",
          summary: true,
          width: columnWidth,
        };

        const isPage = retConfig.data.aSearch.page;
        const queryList = [{ label: "id", value: rowId }];
        const dicMap = retConfig.data.aSearch.dics;
        const basicFieldsList = this.getBasicFieldsList(
          whereField,
          queryList,
          dicMap
        );
        // 设置插槽
        this.setTableColumnButton(actionColumn, toolColumn);
        // 是否添加操作列
        toolColumn.length && columnsView.push(actionColumn);
        const containerList = this.getContainerList(
          columnsView,
          rowId,
          isPage,
          queryList,
          toolColumn
        );
        const toolNavList = this.getToolList(toolList);
        const widgetList = [
          ...basicFieldsList,
          ...toolNavList,
          ...containerList,
        ];
        const importObj = {
          widgetList: widgetList,
          formConfig: this.formConfig,
        };
        this.doJsonImport(importObj);
      } else {
        this.$message.error(retConfig.message);
      }
    },
    // 设置操作插槽按钮
    setTableColumnButton(actionColumn, toolList) {
      const list = toolList.map((item) => {
        return {
          name: item.config.resChname || item.config.resName || "操作",
          type: "primary",
          size: "small",
          id: this.uid(),
          config: {},
          ...item.config,
        };
      });
      actionColumn.dragConfig = JSON.stringify(list);
      const arrBtn = [];
      list.forEach((res) => {
        const { id, name, type, size, config } = res;
        let action = "";
        if (Object.keys(config).length > 0) {
          action = `@${config.action}="line${id}Method(scope.row)"`;
        }
        // ${action}
        arrBtn.push(
          `<el-button ref="line${id}Ref" type="${type}" size="${size}" ${action}>${name}</el-button>`
        );
      });
      const compView = arrBtn.join("");
      actionColumn.compView = `<div class="${actionColumn.prop}">${compView}</div>`;
    },
    doJsonImport(importObj) {
      try {
        this.designer.loadFormJson(importObj);
        this.$message.success(this.i18nt("designer.hint.importJsonSuccess"));
        this.designer.emitHistoryChange();
        this.designer.emitEvent("form-json-imported", []);

        this.designer.widgetList.length &&
          this.designer.setSelected(
            this.designer.widgetList[this.designer.widgetList.length - 1]
          );
      } catch (ex) {
        this.$message.error(ex + "");
      }
    },
    getToolList(toolList) {
      const arr = [];
      if (!toolList.length) {
        return arr;
      }
      // 把操作放进栅格
      const grid = this.designer.copyNewContainerWidget(
        this.containers.find((res) => res.type === "grid")
      );
      toolList.forEach((el) => {
        const list = this.deepClone(
          this.basicFields.find((res) => res.type === "button")
        );
        const config = this.isJsonString(el.config)
          ? JSON.parse(el.config)
          : {};
        list.options = { ...list.options, ...config };
        list.options.name = "button" + el.id;
        list.id = "button" + el.id;
        list.options.label = el.resChname;
        arr.push(list);
      });
      grid.cols[0].widgetList = arr;
      return [grid];
    },
    getBasicFieldsList(whereField, queryList, dics) {
      const grid = this.designer.copyNewContainerWidget(
        this.containers.find((res) => res.type === "grid")
      );
      const arr = [];

      whereField.forEach((el) => {
        if (el.type !== "") {
          let queryComponentName = "input";
          if (el.param1Sub2Type === "DATE") {
            queryComponentName = "date-range";
          } else if (el.param1Sub2Type === "DICTIONARY") {
            queryComponentName = "select";
          }
          const list = this.basicFields.find(
            (res) => res.type === queryComponentName
          );
          list.id = el.param1;
          list.options.name = el.param1;
          list.options.labelHidden = false;
          list.options.label = el.fieldLabel;
          if (queryComponentName === "select") {
            list.options.optionItems = dics[el.param1];
            list.options.props.label = "text";
            list.options.props.value = "code";
          }
          arr.push(list);
          queryList.push({
            label: el.param1,
            value: "",
          });
          if (el.param2) {
            queryList.push({
              label: el.param2,
              value: "",
            });
          }
        }
      });
      if (!arr.length) {
        return [];
      }
      grid.cols[0].widgetList = arr;
      return [grid];
    },
    getContainerList(columnsView, id, page, queryList, tools) {
      const toolList = tools.map((item) => {
        return this.basicFields
          .filter((res) => res.type === "button")
          .map((i) => {
            const options = { ...i.options, ...item.config };
            return {
              ...i,
              options,
            };
          })[0];
      });
      const params = { id: id };
      // 创建表格
      if (columnsView.length > 0) {
        const table = {
          ...this.designer.copyNewContainerWidget(
            this.containers.find((res) => res.type === "gdTable")
          ),
        };
        const newTable = {
          ...table,
          id: "gdTable" + id,
          searchId: id,
          tableType: "custom",
          rows: [...toolList],
          options: {
            ...table.options,
            tableSearchData: queryList,
            tableConfig: {
              ...table.options.tableConfig,
              url: "/gdbpm/BiSearchdef/executeBiQuery",
              config4: JSON.stringify(params),
              config5: "data.records",
            },
            otherConfig: {
              stripe: true,
              border: true,
              isPage: !!page,
              totalName: "data.total",
              currentName: "current",
              currentValue: 1,
              sizeName: "size",
              sizeValue: 10,
            },
            name: "gdTable" + id,
            tableColumn: columnsView.map((item, index) => {
              return {
                ...item,
                tId: 1000 + index,
              };
            }),
          },
        };
        return [newTable];
      }
      return [];
    },
    getCoumns(d) {
      let arr = [];
      if (d.data.length > 0) {
        d.data = d.data.filter((res) => res.visible);
        arr = d.data.map((item) => {
          const configData =
            item.config && this.isJsonString(item.config)
              ? JSON.parse(item.config)
              : {};
          return {
            label: item.label,
            prop: item.alias,
            name: item.resName,
            id: item.resId,
            align: "center",
            width: configData.width,
            dictCode: item.dictCode,
          };
        });
      }
      return arr;
    },
    async getTreeTypeAndSearchDef() {
      const resData = await getTreeTypeAndSearchDef({ code: "mbglml" });
      this.dataTree = resData.data.children;
    },
    isBanned(wName) {
      return this.getBannedWidgets().indexOf(wName) > -1;
    },

    showFormTemplates() {
      if (this.designerConfig["formTemplates"] === undefined) {
        return true;
      }

      return !!this.designerConfig["formTemplates"];
    },

    loadWidgets() {
      this.containers = this.containers
        .map((con) => {
          return {
            ...con,
            displayName: this.i18n2t(
              `designer.widgetLabel.${con.type}`,
              `extension.widgetLabel.${con.type}`
            ),
          };
        })
        .filter((con) => {
          return !con.internal && !this.isBanned(con.type);
        });

      this.basicFields = this.basicFields
        .map((fld) => {
          return {
            ...fld,
            displayName: this.i18n2t(
              `designer.widgetLabel.${fld.type}`,
              `extension.widgetLabel.${fld.type}`
            ),
          };
        })
        .filter((fld) => {
          return !this.isBanned(fld.type);
        });

      this.advancedFields = this.advancedFields
        .map((fld) => {
          return {
            ...fld,
            displayName: this.i18n2t(
              `designer.widgetLabel.${fld.type}`,
              `extension.widgetLabel.${fld.type}`
            ),
          };
        })
        .filter((fld) => {
          return !this.isBanned(fld.type);
        });

      this.customFields = this.customFields
        .map((fld) => {
          return {
            ...fld,
            displayName: this.i18n2t(
              `designer.widgetLabel.${fld.type}`,
              `extension.widgetLabel.${fld.type}`
            ),
          };
        })
        .filter((fld) => {
          return !this.isBanned(fld.type);
        });
    },
    tableSpanMethod(originObj) {
      if (this.activeIndex < 10) {
        this.designer.addContainerByDbClick(originObj, 1, this.activeIndex + 1);
      } else {
        const arr = this.activeIndex.toString().split("");
        this.designer.addContainerByDbClick(
          originObj,
          parseInt(arr[1]) + 1,
          parseInt(arr[0]) + 1
        );
      }
    },
    handleContainerWidgetClone(originObj) {
      // console.log(originObj, 'originorigin')
      return this.designer.copyNewContainerWidget(originObj);
    },

    handleFieldWidgetClone(origin) {
      return this.designer.copyNewFieldWidget(origin);
    },

    checkContainerMove(evt) {
      return this.designer.checkWidgetMove(evt);
    },

    onContainerDragEnd(evt) {
      // console.log('Drag end of container: ')
      // console.log(evt)
    },

    addContainerByDbClick(container) {
      this.designer.addContainerByDbClick(container);
    },

    addFieldByDbClick(widget) {
      this.designer.addFieldByDbClick(widget);
    },

    loadFormTemplate(inportModuleObj, ft) {
      this.$confirm(
        this.i18nt("designer.hint.loadFormTemplateHint"),
        this.i18nt("render.hint.prompt"),
        {
          confirmButtonText: this.i18nt("render.hint.confirm"),
          cancelButtonText: this.i18nt("render.hint.cancel"),
        }
      )
        .then(() => {
          const importObj = JSON.parse(inportModuleObj);
          this.doJsonImport(importObj);
          localStorage.setItem("moduleId", JSON.stringify(ft));
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-container {
  padding-bottom: 10px;
  height: 100%;
  /deep/.el-tabs {
    height: 100%;
  }
  /deep/ .el-tabs__content {
    height: calc(100% - 40px);
  }

  /deep/.el-tabs__header {
    margin: 0;
    padding: 0;
    height: 40px;
    margin-bottom: 0;
    background: #fff;
    border: none;
    // padding: 0 16px;
    position: relative;
    margin: 0;
    padding-top: 4px;
    box-sizing: border-box;
    .el-tabs__nav {
      height: 36px;
    }
    .el-tabs__nav-wrap {
      padding: 0 16px;
      &::after {
        height: 1px;
      }
    }
    .el-tabs__item {
      font-weight: 600 !important;
      color: #303133 !important;
      margin-right: 4px;
      border: 1px solid #e4e7ed;
      box-sizing: border-box;
      text-align: center;
      padding-left: 0;
      height: 36px;
      line-height: 36px;
      background: #f2f6fc;
      border-radius: 6px 6px 0px 0px;
      width: 107px;
      padding: 0;
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item.is-active {
      background: #409eff;
      border-color: #409eff;
      color: #fff !important;
      text-align: center;
      padding-left: 0;
    }
  }
  /deep/ .el-collapse-item__header {
    font-weight: 550;
    position: relative;
    padding-left: 16px;
    &::before {
      position: absolute;
      content: "";
      width: 3px;
      height: 16px;
      background: #409eff;
      border-radius: 2px;
      left: 6px;
    }
  }
  .my-el-tab-pane {
    height: 100%;
    .widget-collapse {
      height: 100%;
      overflow: auto;
      padding: 0 10px 10px 10px;
      box-sizing: border-box;
      border: none;
      .last-el-collapse-item {
        /deep/ .el-collapse {
          border-top: none;
        }
        /deep/ .el-collapse-item__wrap {
          border-bottom: none !important;
        }
      }
    }
  }
}
.table_span {
  width: 250px;
  height: 250px;
  display: flex;
  flex-wrap: wrap;
  .span_class {
    display: inline-block;
    width: calc(10% - 4px);
    height: calc(10% - 4px);
    border: 1px solid #e9e9e9;
    box-sizing: border-box;
    margin: 2px;
    background: #f8f8f8;
  }
  .spanActive {
    border: 1px solid #c3d9ff;
    background: #ddeafb;
  }
}

.item_span {
  padding-left: 29px;
  position: relative;
  img {
    width: 20px;
    position: absolute;
    top: -3px;
    left: 6px;
  }
}
.item_span_img {
  img {
    width: 16px !important;
  }
}

.no-bottom-margin .el-tabs__header {
  margin-bottom: 0;
}

.indent-left-margin {
  .el-tabs__nav {
    margin-left: 20px;
  }
}

.el-collapse-item ul > li {
  list-style: none;
}

.el-collapse-item__header {
  margin-left: 8px;
  font-style: italic;
  font-weight: bold;
}

/deep/ .el-collapse-item__content {
  padding-bottom: 0px !important;
  ul {
    margin: 0;
    padding: 0;
    padding-top: 1px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    .container-widget-item,
    .field-widget-item {
      display: inline-block;
      height: 36px;
      line-height: 36px;
      width: calc(50% - 16px);
      cursor: move;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      background: #ffffff;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      margin-bottom: 16px;
    }

    .container-widget-item:hover,
    .field-widget-item:hover {
      background: #ebeef5;
      outline: 1px solid #409eff;
    }
    .container-widget-item-last {
      margin-right: auto;
      margin-left: 8px;
    }

    .drag-handler {
      position: absolute;
      top: 0;
      left: 160px;
      background-color: #dddddd;
      border-radius: 5px;
      padding-right: 5px;
      font-size: 11px;
      color: #666666;
    }
  }
}

.el-card.ft-card {
  // border: 1px solid #8896b3;
  /deep/ .el-card__body {
    padding: 0 !important;
  }
}

.ft-card {
  margin-bottom: 16px;

  .bottom {
    // margin-top: 10px;
    // line-height: 12px;
  }

  .ft-title {
    font-size: 13px;
    font-weight: bold;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 16px;
  }
  .ft-warp {
    display: flex;
    height: 40px;
    background: #f5f7fa;
    justify-content: space-around;
    color: #409eff;
    .left-button {
      width: 50%;
      border-right: solid 1px #e4e7ed;
    }
    .right-button {
      width: 50%;
      text-align: center;
      // border-right: solid 1px #e4e7ed;
    }
  }
}
</style>
<style lang="scss" scoped>
.my-el-tab-pane {
  ::-webkit-scrollbar {
    display: none;
    width: 0;
  }
}
</style>
