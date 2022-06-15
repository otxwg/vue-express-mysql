<template>
  <div
    class="field-wrapper"
    @click.stop="clickGdTable"
    :class="[selected ? 'selected' : '']"
    :style="styleObj"
  >
    <gd-table
      ref="gdtable"
      :columns="tableColumn"
      :data="
        widget.options.tableConfig.config2 === '1'
          ? tableData
          : tableDataFormLine
      "
      :hiddenPage="false"
      :border="otherConfig.border"
      :stripe="otherConfig.stripe"
      :size="otherConfig.size"
      :height="otherConfig.height"
      :max-height="otherConfig['max-height']"
      :total="total"
      columnSortable
      :page-params="queryForm"
      @pagination="initTable"
      @on-column-sort="onColumnSort"
    >
      <!-- 特殊的字段处理 -->
      <template
        v-for="(item, index) in tableColumn"
        :slot="item.prop"
        slot-scope="scope"
      >
        <!-- <add-item v-if="item[`props${item.prop}useValue`] === '1'" :key="index" :item-data="item" :row-data="scope" :page-params="queryForm"></add-item>
        <span v-else :key="index">{{ scope.row[item.prop] }}</span>  slot-scope="scope"-->
        <draggable
          :key="item['tId'] + index"
          :list="widget.rows"
          v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
          handle=".drag-handler"
          @end="(evt) => onGridDragEnd(evt, widget.rows, item, scope.row)"
          @add="(evt) => onGridDragAdd(evt, widget.rows, item, scope.row)"
          @update="onGridDragUpdate"
          :move="checkContainerMove"
        >
          <transition-group
            name="fade"
            tag="div"
            class="form-widget-list"
            style="min-height: 28px"
          >
            <span
              v-if="item.summary"
              :key="item['tId'] + index"
              @click="cellDblclick(item, scope.row)"
            >
              <add-item
                :item-data="item"
                :row-data="scope"
                :page-params="queryForm"
                style="pointer-events: none"
              >
              </add-item>
            </span>
            <span v-else :key="item['tId'] + index"
              >{{ scope.row[item.prop] }}
            </span>
            <!-- <template v-for="(subWidget, swIdx) in widget.rows">
              <template v-if="'container' === subWidget.category">
                <component
                  :is="subWidget.type + '-widget'"
                  :widget="subWidget"
                  :designer="designer"
                  :key="subWidget.id"
                  :parent-list="widget.rows"
                  :index-of-parent-list="swIdx"
                  :parent-widget="widget"
                ></component>
              </template>
              <template v-else>
                <component
                  :is="subWidget.type + '-widget'"
                  :field="subWidget"
                  :designer="designer"
                  :key="subWidget.id"
                  :parent-list="widget.row"
                  :index-of-parent-list="swIdx"
                  :parent-widget="widget"
                  :design-state="true"
                ></component>
              </template>
            </template> -->
          </transition-group>
        </draggable>
      </template>
    </gd-table>
    <gd-dialog
      :title="'配置信息'"
      size="small"
      :z-index="2001"
      :closed.sync="showDialog"
      :append-to-body="true"
      draggable
      width="850px"
      height="600px"
    >
      <el-tabs
        v-model="activeName"
        type="border-card"
        closable
        @tab-click="handleClick"
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="(item, index) in rowList"
          :key="'rowList' + index"
          :label="item.name"
          :name="item.id"
        >
          <el-form ref="ruleFormModule" label-width="80px" :inline="true">
            <el-form-item label="名称:">
              <el-input v-model="item.name" size="small" />
            </el-form-item>
            <el-form-item label="编号:">
              <el-input v-model="item.id" size="small" />
            </el-form-item>
            <el-form-item label="大小:">
              <el-input v-model="item.size" size="small" />
            </el-form-item>
            <el-form-item label="类型:">
              <el-input v-model="item.type" size="small" />
            </el-form-item>
            <el-form-item label="事件:">
              <el-select
                v-model="item.config.action"
                placeholder="请选择"
                size="small"
                style="width: 210px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="item.config.action && item.config.action !== ''"
              label="响应:"
            >
              <el-select
                v-model="item.config.req"
                placeholder="请选择"
                size="small"
                style="width: 210px"
              >
                <el-option
                  v-for="item in optionsReq"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="item.config.req === 'openDialog'"
              label="弹框类型:"
            >
              <el-select
                v-model="item.config.dialogDataType"
                placeholder="请选择"
                size="small"
                style="width: 210px"
              >
                <el-option
                  v-for="item in [
                    { value: 'justDialog', label: '仅弹框' },
                    { value: 'showBaseData', label: '展示基础数据' },
                    { value: 'showIframeData', label: '展示iframe表单数据' },
                  ]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="item.config.req === 'openDialog'"
              label="值来源:"
            >
              <el-select
                v-model="item.config.dataFrom"
                placeholder="请选择"
                size="small"
                style="width: 210px"
              >
                <el-option
                  v-for="item in [
                    { value: 'tableList', label: '列表数据' },
                    { value: 'requestData', label: '接口请求' },
                  ]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="item.config.req === 'routerPath'"
              label="路由地址:"
            >
              <el-input v-model="item.config.routerPath" size="small" />
            </el-form-item>
            <el-form-item
              v-if="
                item.config.req === 'deleteBtn' ||
                item.config.dataFrom === 'requestData'
              "
              :label="'接口地址'"
            >
              <el-input
                type="text"
                v-model="item.config.url"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="item.config.dataFrom === 'requestData'"
              label="返回字段："
              label-width="80px"
            >
              <el-select
                v-model="item.config.backData"
                filterable
                allow-create
                default-first-option
                clearable
                placeholder="请选择或输入数据返回字段名称"
                size="small"
              >
                <el-option
                  v-for="item in options6"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="
                item.config.req === 'deleteBtn' ||
                item.config.dataFrom === 'requestData'
              "
              :label="'请求方式'"
            >
              <el-select
                v-model="item.config.methodType"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in optionsMethod"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="item.config.req === 'deleteBtn'"
              :label="'删除提示'"
            >
              <el-input
                type="text"
                v-model="item.config.canDeleteMsg"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="item.config.req === 'deleteBtn'"
              :label="'成功提示'"
            >
              <el-input
                type="text"
                v-model="item.config.successMsg"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="item.config.req === 'deleteBtn'"
              :label="'错误提示'"
            >
              <el-input
                type="text"
                v-model="item.config.errMsg"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="item.config.req === 'openDialog'"
              label="弹框编码:"
            >
              <el-input v-model="item.config.openDialog" size="small" />
            </el-form-item>
            <el-form-item
              v-if="item.config.req === 'openDialog'"
              label="表单编码:"
            >
              <el-input v-model="item.config.iframeCode" size="small" />
            </el-form-item>
            <el-row>
              <el-divider class="custom-divider-margin-top">参数</el-divider>

              <div
                v-for="(itemParams, indexParams) in item.config.paramsList"
                :key="indexParams"
              >
                <el-form-item label="要传的参数名:" label-width="120px">
                  <el-input
                    v-model="itemParams.paramsName"
                    size="small"
                    style="width: 180px"
                  />
                </el-form-item>
                <el-form-item label="列表参数名:" label-width="120px">
                  <el-select
                    allow-create
                    v-model="itemParams.tableName"
                    placeholder="请选择"
                    size="small"
                    style="width: 180px"
                    filterable
                  >
                    <el-option
                      v-for="(item, index) in rowTable"
                      :key="index"
                      :label="index"
                      :value="index"
                    ></el-option>
                  </el-select>
                  <el-button
                    type="warning"
                    size="mini"
                    @click="deleteRow(item.config.paramsList, index)"
                    >删除</el-button
                  >
                </el-form-item>
              </div>
              <div style="text-align: center">
                <el-button
                  type="primary"
                  size="mini"
                  @click="addRow(item.config)"
                  >新增</el-button
                >
              </div>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <template slot="footer">
        <div>
          <el-button size="small" type="primary" @click="submitImportData"
            >确定</el-button
          >
          <el-button size="small" @click="showDialog = false">关闭</el-button>
        </div>
      </template>
    </gd-dialog>
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
        <!-- <i>{{ i18n2t(`designer.widgetLabel.${field.type}`, `extension.widgetLabel.${field.type}`) }}</i> -->
        <i v-if="field.options.hidden === true" class="iconfont icon-hide"></i>
      </div>
    </template>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import i18n from "../../../../utils/i18n";
import FieldComponents from "../field-widget/index";
import AddItem from "../../../common/add-item.vue";
import { genVueData } from "../../../../utils/vue2js-generator";
import { defaultCode } from "./default_code";
// import { default as request, getDesignerUrl } from '@wfruntime/util/request'
import request from "@/axios";
const Qs = require("qs");
export default {
  name: "gdTable-widget",
  componentName: "FieldWidget", //必须固定为FieldWidget，用于接收父级组件的broadcast事件
  components: { ...FieldComponents, Draggable, AddItem },
  mixins: [i18n],
  data() {
    return {
      activeName: "",
      showDialog: false,
      border: true,
      stripe: false,
      total: 0,
      rowList: [],
      rowTable: {},
      formData: {},
      options6: [
        {
          value: "data",
          label: "data",
        },
        {
          value: "data.records",
          label: "data.records",
        },
      ],
      optionsReq: [
        {
          value: "routerPath",
          label: "路由跳转",
        },
        {
          value: "openDialog",
          label: "打开弹框",
        },
        {
          value: "deleteBtn",
          label: "删除操作",
        },
      ],
      optionsMethod: [
        {
          value: "post",
          label: "post",
        },
        {
          value: "get",
          label: "get",
        },
      ],
      rowObj: {},
      options: [
        {
          value: "click",
          label: "单击",
        },
        {
          value: "dblclick",
          label: "双击",
        },
      ],
      tableDataFormLine: [],
      queryForm: {
        current: 1,
        size: 10,
      },
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
    styleObj() {
      let str = "";
      const style = this.field.options.styleObj || {};
      Object.keys(style).forEach((k) => {
        let value = Number(style[k]);
        if (!Number.isNaN(value)) {
          value += "px";
        } else {
          value = style[k];
        }
        str += `${k}:${value};`;
      });
      return str;
    },
    selected() {
      return !!this.designer && this.field.id === this.designer.selectedId;
    },
    otherConfig() {
      return this.widget.options.otherConfig;
    },
    tableColumn() {
      if (typeof this.widget.options.tableColumn === "string") {
        return [];
      } else {
        if (this.widget.options.tableColumn.length > 0) {
          return this.widget.options.tableColumn;
        } else {
          return [];
        }
      }
    },
    tableData() {
      return JSON.parse(this.widget.options.tableData);
    },
  },
  watch: {
    "widget.options.tableData": {
      deep: true,
      handler(val) {
        if (
          this.widget.options.tableConfig.config2 === "0" &&
          this.widget.options.tableConfig.url !== ""
        ) {
          this.getTableList();
        }
      },
    },
  },
  mounted() {
    if (
      this.widget.options.tableConfig.config2 === "0" &&
      this.widget.options.tableConfig.url !== ""
    ) {
      this.getTableList();
    }
  },
  methods: {
    onColumnSort() {
      setTimeout(() => {
        this.widget.options.tableColumn = this.$refs.gdtable.tableColumns;
      }, 500);
    },
    removeTab(targetName) {
      this.rowList = this.rowList.filter((res) => res.id !== targetName);
    },
    deleteRow(arr, index) {
      arr.splice(index, 1);
    },
    // 新增参数行
    addRow(row) {
      if (row.paramsList === undefined) {
        this.$set(row, "paramsList", [{ paramsName: "", tableName: "" }]);
      } else {
        row.paramsList.push({ paramsName: "", tableName: "" });
      }
    },
    handleClick() {},
    cellDblclick(row, rowTable) {
      this.rowObj = row;
      this.rowTable = rowTable;
      this.showDialog = true;
      this.rowList = JSON.parse(row.dragConfig);

      this.activeName = this.rowList[0].id;
    },
    submitImportData() {
      // 如果是按钮
      let compView = this.setButton({
        dragConfig: JSON.stringify(this.rowList),
      });
      const tableColumn = this.widget.options.tableColumn;
      let newObj =
        tableColumn.find(
          (res) =>
            res.prop === this.rowObj.prop || res.type === this.rowObj.prop
        ) || {};

      const strDiv = `<div class="${this.rowObj.prop}">${compView}</div>`;
      this.$set(newObj, "compView", strDiv);
      this.$set(this.rowObj, "dragConfig", JSON.stringify(this.rowList));
      this.setCompJavascript();
      if (this.rowList.length === 0) {
        this.$set(newObj, "summary", true);
      }
      this.showDialog = false;
    },
    // 设置按钮的js
    setCompJavascript() {
      let jsData = "";

      const routerPath = this.routerMethod();
      jsData = defaultCode(this.rowObj, routerPath);
      this.$set(this.rowObj, "compJavascript", jsData);
    },
    // 获取参数
    getParams(list) {
      let newArr = [];
      if (list && list.length > 0) {
        list.forEach((res) => {
          if (res.tableName === "") {
            newArr.push(`${res.paramsName}:''`);
          } else if (!this.rowTable.hasOwnProperty(res.tableName)) {
            newArr.push(`${res.paramsName}:'${res.tableName}'`);
          } else if (this.rowTable.hasOwnProperty(res.tableName)) {
            newArr.push(`${res.paramsName}:params.${res.tableName}`);
          }

          // newObj[res.paramsName] = `params.${res.tableName}`
        });
      }
      return newArr.join(",");
    },
    routerMethod() {
      let arrRouter = [];
      const dragConfig = JSON.parse(this.rowObj.dragConfig);

      dragConfig.forEach((res) => {
        const paramsObj = this.getParams(res.config.paramsList);
        if (res.config.req === "routerPath") {
          arrRouter.push(`
            line${res.id}Method(params) {
             this.$router.push({path:'${res.config.routerPath}',query:{${paramsObj}}})
            },
          `);
        } else if (res.config.req === "deleteBtn") {
          const methodName = `${
            res.config.methodType === "get" ? "params" : "data"
          } `;
          const dataVal =
            res.config.methodType === "get"
              ? `{${paramsObj}}`
              : `this.qsMethod.stringify({${paramsObj}})`;
          arrRouter.push(`
           line${res.id}Method(params) {
            this.$confirm('${res.config.canDeleteMsg || "是否删除"}', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              const resData = await this.requestMethod({
                url: '${res.config.url}',
                method: '${res.config.methodType}',
                ${methodName}: ${dataVal}
              })
              this.$message.success('${res.config.successMsg || "删除成功"}')
            })
            },
          `);
        } else if (res.config.req === "openDialog") {
          let newdata = "";
          // 如果是iframe数据
          if (res.config.dialogDataType === "showIframeData") {
            // 是列表数据
            if (res.config.dataFrom === "requestData") {
              const methodName = `${
                res.config.methodType === "get" ? "params" : "data"
              } `;
              const dataVal =
                res.config.methodType === "get"
                  ? `{${paramsObj}}`
                  : `this.qsMethod.stringify({${paramsObj}})`;
              newdata = `const resData = await this.requestMethod({
                        url: '${res.config.url}',
                        method: '${res.config.methodType}',
                        ${methodName}: ${dataVal}
                      })
                      const row = resData.${res.config.backData}
                      
                      this.$refs.${res.config.iframeCode}.contentWindow.FormApi.setData(JSON.stringify(row))
                    `;
            } else if (res.config.dataFrom === "tableList") {
              // 是从列表获取的数据

              newdata = `this.$refs.${res.config.iframeCode}.contentWindow.FormApi.setData(JSON.stringify({${paramsObj}}))`;
            }
          }
          arrRouter.push(`
            async line${res.id}Method(params) {
              this.${res.config.openDialog}Dialog = true
              this.$nextTick(() => {
                
                setTimeout(() => {
                  
                    ${newdata}
                },100)
              })
              
            },
          `);
        }
      });
      return arrRouter.join("");
    },
    uid() {
      const rnd = Math.floor(Math.random() * 1000);
      const timestamp = new Date().getTime();
      return [timestamp, rnd].join("");
    },
    // 设置拖入表格的按钮
    dragToTable(evt, subList, item) {
      const prop = item.prop;
      const tableColumn = this.widget.options.tableColumn;

      let arrObj = {
        name: item.label,
        type: "primary",
        size: "small",
        id: this.uid(),
        config: {},
      };
      if (tableColumn.length > 0) {
        let newObj =
          tableColumn.find((res) => res.prop === prop || res.type === prop) ||
          {};
        if (newObj.dragConfig && newObj.dragConfig !== "") {
          let arrData = JSON.parse(newObj.dragConfig);
          arrData.push(arrObj);
          this.$set(newObj, "dragConfig", JSON.stringify(arrData));
        } else {
          this.$set(newObj, "dragConfig", JSON.stringify([arrObj]));
        }

        // 如果是按钮
        let compView = this.setButton(newObj);

        const strDiv = `<div class="${prop}">${compView}</div>`;
        this.$set(newObj, "compView", strDiv);
        this.$set(newObj, "summary", true);
      }
    },
    // 设置按钮
    setButton(newObj) {
      let arrBtn = [];
      const dragConfig = JSON.parse(newObj.dragConfig);
      dragConfig.forEach((res) => {
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
      return arrBtn.join("");
    },
    onGridDragEnd(evt, subList, prop) {},
    onGridDragAdd(evt, subList, item) {
      const newIndex = evt.newIndex;
      if (!!subList[newIndex]) {
        this.designer.setSelected(subList[newIndex]);
      }
      this.designer.emitHistoryChange();
      this.dragToTable(evt, subList, item);
    },
    onGridDragUpdate() {
      this.designer.emitHistoryChange();
    },
    checkContainerMove(evt) {
      return this.designer.checkWidgetMove(evt);
    },
    // 处理表格数据
    async getTableList(page = "", limit = "") {
      let params = {};
      if (this.widget.options.tableConfig.config4 !== "") {
        params = JSON.parse(this.widget.options.tableConfig.config4);
      }
      if (this.widget.options.tableSearchData.length > 0) {
        this.widget.options.tableSearchData.forEach((res) => {
          params[res.label] = res.value;
        });
      }
      if (this.widget.options.otherConfig.isPage) {
        params[this.widget.options.otherConfig.currentName] =
          page === "" ? this.widget.options.otherConfig.currentValue : page;
        params[this.widget.options.otherConfig.sizeName] =
          limit === "" ? this.widget.options.otherConfig.sizeValue : limit;
        this.queryForm = {
          current: parseInt(this.widget.options.otherConfig.currentValue),
          size: parseInt(this.widget.options.otherConfig.sizeValue),
        };
      }
      const backType =
        this.widget.options.tableConfig.config5 || "data.records";
      const totalType = this.widget.options.otherConfig.totalName;
      const requestType = this.widget.options.tableConfig.method;
      let newData = {};
      if (requestType === "post") {
        newData = await request({
          // url: getDesignerUrl() + this.widget.options.tableConfig.url,
          // method: "post",
          // data: Qs.stringify(params),
        });
      } else {
        newData = await request({
          // url: getDesignerUrl() + this.widget.options.tableConfig.url,
          // method: "get",
          // params: {
          //   ...params,
          // },
        });
      }
      let totalData = JSON.parse(JSON.stringify(newData));
      if (backType && backType !== "" && backType.includes(".")) {
        backType.split(".").forEach((res) => {
          newData = newData[res];
        });
      } else {
        newData = newData[backType];
      }
      if (totalType && totalType !== "" && totalType.includes(".")) {
        totalType.split(".").forEach((res) => {
          totalData = totalData[res];
        });
        this.total = totalData;
      } else {
        this.total = totalData[totalType];
      }
      const resetMethed = eval(
        `(${this.widget.options.tableConfig.configMethod})`
      );
      this.tableDataFormLine = resetMethed(newData);
    },
    initTable({ page, limit }) {
      this.getTableList(page, limit);
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
