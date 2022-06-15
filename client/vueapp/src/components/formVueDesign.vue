<template>
  <div style="padding: 10px">
    <GdForm
      ref="gdForm"
      @setMenu="setMenu"
      @getFormModule="getFormModule"
      @getBaseInfoForm="getBaseInfoForm"
      @templateData="templateData"
      @productionMetadata="productionMetadata"
      :descpData="descp"
      :form-module-list="formModuleList"
    ></GdForm>
    <gdDialog
      title="表单基本信息"
      size="small"
      :z-index="2001"
      :closed.sync="formMessageDialog"
      :append-to-body="true"
      width="400px"
      draggable
    >
      <el-form
        :inline="true"
        :model="formInline"
        :rules="rules"
        ref="ruleForm"
        class="demo-form-inline"
        label-width="100px"
      >
        <el-form-item label="表单名称" prop="name">
          <el-input
            size="small"
            v-model="formInline.name"
            placeholder="表单名称"
            style="width: 230px"
          ></el-input>
        </el-form-item>
        <el-form-item label="表单编码" prop="key">
          <el-input
            size="small"
            v-model="formInline.key"
            placeholder="表单编码"
            style="width: 230px"
          ></el-input>
        </el-form-item>
        <el-form-item label="表单分类" prop="treeId">
          <el-select
            v-model="formInline.treeId"
            placeholder="请选择表单分类"
            size="small"
          >
            <el-option
              v-for="(item, index) in typeData"
              :key="index"
              :label="item.text"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印模板">
          <el-select
            v-model="formInline.templateId"
            placeholder="请选择打印文件模板"
            size="small"
          >
            <el-option
              v-for="(item, index) in printData"
              :key="index"
              :label="item.attachName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <div>
          <el-button
            type="primary"
            icon="el-icon-circle-check"
            @click="onSubmit"
            >提交</el-button
          >
        </div>
      </template>
    </gdDialog>
    <gdDialog
      title="表单模板信息"
      size="small"
      :z-index="2001"
      :closed.sync="formModuleDialog"
      :append-to-body="true"
      width="360px"
      draggable
    >
      <el-form
        :model="formData"
        :rules="rulesModule"
        ref="ruleFormModule"
        class="demo-form-inline"
        label-width="100px"
      >
        <el-form-item label="表单名称:" prop="compValue">
          <el-input v-model="formData.compValue" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="表单编号:" prop="compKey">
          <el-input v-model="formData.compKey" placeholder="请输入字典编号" />
        </el-form-item>
        <el-form-item label="表单排序:" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :min="1"
            controls-position="right"
            size="small"
            placeholder="请输入字典排序"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <div>
          <el-button type="primary" @click="onSubmitModule">{{
            isEditBol ? "修改" : "确定"
          }}</el-button>
        </div>
      </template>
    </gdDialog>
    <gdDialog
      title="生成业务模型并保存"
      size="small"
      :z-index="2001"
      :closed.sync="showMetadataDailog"
      :append-to-body="true"
      width="800px"
      draggable
    >
      <gd-table
        :data="tableData"
        :columns="columns"
        class="waring-table"
        stripe
        border
      >
        <template slot="contain" slot-scope="scope">
          <!-- 预警 -->
          <span>{{ scope.row.contain ? "是" : "否" }}</span>
        </template>
      </gd-table>
      <template slot="footer">
        <div>
          <el-button type="primary" @click="onSubmitData">确定</el-button>
          <el-button type="primary" @click="showMetadataDailog = false"
            >取消</el-button
          >
        </div>
      </template>
    </gdDialog>
  </div>
</template>
<script>
const GdForm = () => import("./onlineVueEditor/components/form-designer");

import {
  getDesignerList,
  addDesignerList,
  updateDesignerList,
  removeDesignerList,
} from "../api/index";
export default {
  name: "gd_form_design_item",
  components: {
    GdForm: GdForm,
  },
  data() {
    return {
      viewId: "",
      descp: "",
      tableData: [],
      columns: [
        {
          label: "属性名",
          prop: "name",
          align: "center",
        },
        {
          label: "数据类型",
          prop: "dataType",
          align: "center",
        },
        {
          label: "控件类型",
          prop: "control",
          align: "center",
        },
        {
          label: "备注",
          prop: "comment",
          align: "center",
        },
        {
          label: "版本",
          prop: "status",
          align: "center",
        },
        {
          label: "冲突",
          prop: "contain",
          align: "center",
        },
      ],
      currentRow: { code: "" },
      showDialogMenu: false,
      showMetadataDailog: false,
      formObj: {},
      formList: {},
      jsonData: {},
      formMessageDialog: false,
      formModuleDialog: false,
      configList: [],
      designer: {},
      templateObj: {},
      formInline: {
        name: "",
        key: "",
        treeId: "",
        templateId: "",
      },
      menuObj: {},
      formModuleList: [],
      moduleObj: {},
      formData: {
        id: "",
        compKey: "",
        compValue: "",
        status: 1,
        type: "内置控件",
        sort: "",
        typeCode: "formModule",
        properties: "",
        source: "线上",
        compCss: "",
        compJavascript: "",
        compView: "",
        compType: "内置控件",
      },
      rulesModule: {
        compValue: [
          { required: true, message: "请输入表单名称", trigger: "blur" },
        ],
        compKey: [
          { required: true, message: "请输入表单编号", trigger: "blur" },
        ],
      },
      rules: {
        name: [{ required: true, message: "请填写表单名称", trigger: "blur" }],
        key: [{ required: true, message: "请填写表单编码", trigger: "blur" }],
        treeId: [
          { required: true, message: "请选择表单分类", trigger: "blur" },
        ],
      },
      methodName: "",
      isEditBol: false,
      printData: [],
      typeData: [],
    };
  },
  methods: {
    // 选择图标
    showCusIconDialog() {
      this.$refs.iconSelector.visibleIcon = true;
    },
    formIconChanged(item) {
      this.formDataMenu["icon"] = item;
    },
    getBaseInfoForm(val) {
      this.formMessageDialog = val;
    },
    // 生成菜单
    setMenu(val, template) {
      this.showDialogMenu = true;
      this.menuObj = {
        val,
        template,
      };
    },
    getFormModule(val, template) {
      this.formModuleDialog = true;
      this.formData.compJavascript = JSON.stringify(val);
      this.formData.compView = JSON.stringify(template);
      this.isEdit();
    },
    // 判断是否是修改
    isEdit() {
      const moduleObj = localStorage.getItem("moduleId");
      if (moduleObj && this.isJsonString(moduleObj)) {
        this.moduleObj = JSON.parse(moduleObj);
        this.formData.compValue = this.moduleObj.compValue;
        this.formData.compKey = this.moduleObj.compKey;
        this.formData.sort = this.moduleObj.sort;
        this.formData.id = this.moduleObj.id;
        this.isEditBol = true;
      } else {
        this.isEditBol = false;
        this.moduleObj = {};
      }
    },
    setInitData() {},
    // 生成元数据
    productionMetadata(val) {
      if (this.viewId === "") {
        this.$message.warning("请保存表单");
        return;
      }
      this.descp = val;
      this.showMetadataDailog = true;
      getVueBoEntInfo({ viewId: this.viewId, descp: JSON.stringify(val) }).then(
        (res) => {
          this.tableData = res.data.list[0].sysBoAttrs;
        }
      );
    },
    onSubmitData() {
      saveVueFormAndBo({
        viewId: this.viewId,
        descp: JSON.stringify(this.descp),
        deployOrNot: "yes",
      })
        .then((res) => {
          this.$message.success("生成元数据成功");
          this.showMetadataDailog = false;
        })
        .catch(() => {
          this.$message.error("生成元数据失败");
        });
    },
    onSubmit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.saveForm();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 保存表单模板
    onSubmitModule() {
      this.$refs["ruleFormModule"].validate((valid) => {
        if (valid) {
          if (this.isEditBol) {
            this.formData.id = this.moduleObj.id;
            this.methodName = "updatePartColumn";
          } else {
            this.formData.id = "";
            this.methodName = "submit";
          }
          this.getFormModuleList(this.formData, this.methodName);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getFormModuleList(data, methodName) {
      if (!data.id) {
        submit(data).then((res) => {
          this.setMsg(res);
        });
      } else {
        updatePartColumn(data).then((res) => {
          this.setMsg(res, "修改");
        });
      }
    },
    setMsg(res, type = "保存") {
      const resData = res.success;
      if (resData) {
        this.$message({
          type: "success",
          message: type + "表单模板成功!",
        });
        this.formModuleDialog = false;
      } else {
        this.$message({
          type: "warning",
          message: type + "表单模板失败!",
        });
      }
    },
    // 设置配置数据
    async setConfigList(pkId) {
      try {
        const data = await getEditData({ pkId: pkId, forCopy: "" });
        const bpmFormView = data.data.bpmFormView;
        this.descp = bpmFormView.descp;
        this.jsonData = bpmFormView.descp;
        this.templateObj = {
          css: bpmFormView.css,
          js: bpmFormView.javascript,
          html: bpmFormView.templateView,
        };
        // 表单模板信息
        this.formList = {
          html: bpmFormView.templateView,
          css: bpmFormView.css,
          js: bpmFormView.javascript,
        };
        // 表单信息赋值
        this.formInline = {
          name: bpmFormView.name,
          key: bpmFormView.key,
          treeId: bpmFormView.treeId,
          templateId: bpmFormView.templateId,
        };
        if (
          this.descp !== "" &&
          this.descp !== null &&
          this.descp !== undefined
        ) {
          this.configList = JSON.parse(this.descp);
          console.log(this.configList, "this.configList");
          this.$refs.gdForm.setEditData(this.configList, this.formList);
        }
      } catch (err) {
        this.configList = [];
      }
    },
    // 表单保存方法
    saveForm() {
      debugger;
      let data = {
        ...this.formInline,
        viewId: this.viewId,
        type: "ONLINE-VUE-DEV",
        css: this.templateObj.css || "",
        javascript: this.templateObj.js,
        descp: this.jsonData,
        templateView: this.templateObj.html,
      };
      console.log(data, "data");
      updateDesignerList(data).then((res) => {
        this.viewId = res.data.viewId;
        this.descp = res.data.descp;
        this.formMessageDialog = false;
        this.$message.success(res.msg);
      });
    },
    // 点击保存回调
    templateData(formObj, widgetList, designer, jsonData, templateObj) {
      this.formObj = formObj;
      this.jsonData = jsonData;
      this.designer = designer;
      this.templateObj = templateObj;
      // return
      if (widgetList.length === 0) {
        this.$message.info("表单不存在");
        return;
      }
      // 如果是新增,先输入表单信息
      if (this.viewId === "") {
        this.formMessageDialog = true;
        return;
      }

      this.saveForm();
    },
    // 获取表单模板
    async getListByEntity() {},
  },

  mounted() {
    this.setInitData();
    // const type = this.$route.query.type;
    // if (type === "edit") {
    //   this.viewId = this.$route.query.viewId;
    //   this.setConfigList(this.$route.query.id);
    // } else {
    //   this.viewId = "";
    // }
    this.viewId = this.$route.query.viewId;
    this.getListByEntity();
  },
  destroyed() {
    localStorage.removeItem("form__config__backup");
    localStorage.removeItem("widget__list__backup");
    localStorage.removeItem("moduleId");
  },
};
</script>
<style lang="scss" scoped></style>
