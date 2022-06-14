<template>
  <div>
    <el-form-item label="数据来源：" label-width="120px">
      <el-select
        @change="handleChangeDataSource"
        v-model="optionModel.selectConfig.dataSource"
        placeholder="请选择数据来源"
        size="small"
      >
        <el-option
          v-for="item in optionsSource"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="optionModel.selectConfig.dataSource === 'dict'"
      label="数据字典："
      label-width="120px"
    >
      <gd-selectTree
        ref="selectTree"
        :cur-value="optionModel.selectConfig.dict"
        :data="optionsDict"
        :obj="{
          id: 'typeCode',
          label: 'typeName',
          pid: 'parentId',
          children: 'children',
        }"
        check-strictly
        clearable
        filterable
        collapse-tags
        @getValue="
          (val) => {
            optionModel.selectConfig.dict = val;
          }
        "
      />
    </el-form-item>
    <el-form-item
      v-else-if="optionModel.selectConfig.dataSource === 'add'"
      label-width="0"
    >
      <el-divider class="custom-divider-margin-top">{{
        i18nt("designer.setting.optionsSetting")
      }}</el-divider>
      <option-items-setting
        :designer="designer"
        :selected-widget="selectedWidget"
      ></option-items-setting>
    </el-form-item>
    <template v-else>
      <el-divider class="custom-divider-margin-top">接口获取</el-divider>
      <el-form-item label="接口地址：" label-width="80px">
        <el-input type="text" v-model="optionModel.selectConfig.url"></el-input>
      </el-form-item>
      <el-form-item label="请求方式：" label-width="80px">
        <el-select
          v-model="optionModel.selectConfig.methodType"
          placeholder="请选择请求方式"
          size="small"
          clearable
        >
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <template v-if="optionModel.props">
        <el-form-item label="字段名称：" label-width="80px">
          <el-select
            v-model="optionModel.props.label"
            filterable
            allow-create
            default-first-option
            clearable
            placeholder="请选择或输入数据返回字段名称"
            size="small"
          >
            <el-option
              v-for="item in labelKeyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段值：" label-width="80px">
          <el-select
            v-model="
              optionModel.props[
                selectedWidget.type === 'select-tree' ? 'id' : 'value'
              ]
            "
            filterable
            allow-create
            default-first-option
            clearable
            placeholder="请选择或输入数据返回字段值"
            size="small"
          >
            <el-option
              v-for="item in valueKeyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="子节点字段："
          label-width="80px"
          v-if="selectedWidget.type === 'cascader'"
        >
          <el-select
            v-model="optionModel.props.children"
            filterable
            allow-create
            default-first-option
            clearable
            placeholder="请选择或输入数据返回字段名称"
            size="small"
          >
            <el-option
              v-for="item in childrenKeyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <el-form-item label="返回字段：" label-width="80px">
        <el-select
          v-model="optionModel.selectConfig.otherObj.backData"
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
        <el-button
          style="margin-top: 8px"
          type="primary"
          size="mini"
          @click="showDialogMethod = true"
          >接口数据处理</el-button
        >
      </el-form-item>
      <el-form-item label-width="0">
        <el-divider class="custom-divider-margin-top">查询参数</el-divider>
        <div
          style="margin-bottom: 5px"
          v-for="(item, index) in optionModel.selectConfig.searchParams"
          :key="index"
        >
          <el-row>
            <el-col :span="8"
              ><el-input
                type="text"
                v-model="item.label"
                placeholder="字段名"
              ></el-input
            ></el-col>
            <el-col :span="7" v-if="item.type === 'bool'">
              <el-select v-model="item.value">
                <el-option label="true" :value="true"></el-option>
                <el-option label="false" :value="false"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7" v-if="item.type !== 'bool'"
              ><el-input
                type="text"
                v-model="item.value"
                placeholder="字段值"
              ></el-input
            ></el-col>
            <el-col :span="7">
              <el-select v-model="item.type">
                <el-option label="字符串类型" value="string"></el-option>
                <el-option label="数字类型" value="number"></el-option>
                <el-option
                  label="布尔类型"
                  value="bool"
                ></el-option> </el-select
            ></el-col>
            <el-col :span="2" style="color: red; cursor: pointer">
              <!-- <span title="删除" @click="deletOption(index)"><i class="el-icon-delete" style="color: #f56c6c; width: 14px"></i></span> -->
              <el-button
                circle
                plain
                size="mini"
                type="danger"
                @click="deletOption(index)"
                icon="el-icon-minus"
                class="col-delete-button"
                style="padding: 4px"
              ></el-button>
            </el-col>
          </el-row>
        </div>
        <el-button type="text" @click="addOption">增加查询项</el-button>
      </el-form-item>
    </template>
    <gd-dialog
      :title="'接口数据处理'"
      size="small"
      :z-index="2002"
      :closed.sync="showDialogMethod"
      :append-to-body="true"
      draggable
      :maximized.sync="maximized"
      width="800px"
    >
      <code-editor
        :mode="'javascript'"
        :readonly="false"
        v-model="optionModel.selectConfig.otherObj.backMethod"
        style="margin-top: 10px"
      ></code-editor>
      <template slot="footer">
        <div>
          <el-button size="small" @click="showDialogMethod = false"
            >关闭</el-button
          >
        </div>
      </template>
    </gd-dialog>
  </div>
</template>

<script>
import i18n from "../../../../utils/i18n";
import OptionItemsSetting from "./option-items-setting";
import CodeEditor from "../../../code-editor/index";
import propertyMixin from "./propertyMixin";
// import { getSubTypeTree } from '@wfmng/api/system-utils'
function setCascaderData(
  data,
  props = { label: "label", value: "value", children: "children" }
) {
  for (var i = 0; i < data.length; i++) {
    if (!data[i][props.children].length) {
      delete data[i][props.children];
    } else {
      setCascaderData(data[i][props.children], props);
    }
  }
  return data;
}
export default {
  name: "optionItems-editor",
  mixins: [i18n, propertyMixin],
  data() {
    return {
      showDialogMethod: false,
      optionsDict: [],
      valueKeyList: [
        {
          value: "value",
          label: "value",
        },
      ],
      labelKeyList: [
        {
          value: "label",
          label: "label",
        },
      ],
      childrenKeyList: [
        {
          value: "children",
          label: "children",
        },
      ],
      optionsProps: [
        {
          value: "value",
          label: "value",
        },
        {
          value: "label",
          label: "label",
        },
      ],
      optionsSource: [
        {
          value: "dict",
          label: "数据字典",
        },
        {
          value: "add",
          label: "数据设置",
        },
        {
          value: "api",
          label: "接口获取",
        },
      ],
      options4: [
        {
          value: "get",
          label: "GET",
        },
        {
          value: "post",
          label: "POST",
        },
      ],
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
    };
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  computed: {},
  components: {
    OptionItemsSetting,
    CodeEditor,
  },
  async created() {
    // const { data } = await getSubTypeTree({ code: 0 })
    // this.optionsDict = data
  },
  methods: {
    addOption() {
      this.optionModel.selectConfig.searchParams.push({ value: "", label: "" });
    },
    async handleChangeDataSource(val) {
      if (val !== "add") {
        this.optionModel.selectConfig.otherObj.isLine = true;
      }
      if (!this.optionModel.props) {
        this.optionModel.props = {
          label: "label",
          value: "value",
        };
      }
      const valueKey =
        this.selectedWidget.type === "select-tree" ? "id" : "value";
      if (val === "dict") {
        this.optionModel.props.label = "dictValue";
        this.optionModel.props[valueKey] = "dictKey";
      } else {
        this.optionModel.props.label = "label";
        this.optionModel.props[valueKey] = "value";
      }
      if (this.optionModel.props.children) {
        this.optionModel.props.children = "children";
      }
      if (this.selectedWidget.type === "cascader" && val !== "add") {
        this.optionModel.selectConfig.otherObj.backMethod =
          setCascaderData.toString();
      } else {
        this.optionModel.selectConfig.otherObj.backMethod = "";
      }
    },
    deletOption(index) {
      this.optionModel.selectConfig.searchParams.splice(index, 1);
    },
  },
};
</script>

<style scoped></style>
