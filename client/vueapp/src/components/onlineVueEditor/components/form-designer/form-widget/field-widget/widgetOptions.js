// select cascader checkbox radio 数据项获取
// import { dictTree } from '@/projects/system/api/system/dict'
// import request from "@wfruntime/util/request"
import request from "@/axios";
const Qs = require("qs");
import { throttle } from "@/util/index";
export default {
  data() {
    return {
      lineList: [],
    };
  },
  computed: {
    selectProps() {
      console.log(this.field.options.props, 666);
      return this.field.options.props;
    },
    selectorOptions() {
      if (this.dataSource === "add") {
        return this.field.options.optionItems;
      } else {
        return this.lineList;
      }
    },
    throttleRequest() {
      return throttle(this.handleRequestData, 1000);
    },
    dataSource() {
      return this.field.options.selectConfig.dataSource;
    },
  },
  // 实时更新界面数据
  watch: {
    "field.options.selectConfig": {
      handler(val) {
        this.throttleRequest();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleRequestData() {
      const config = this.field.options.selectConfig;
      const dataSource = config.dataSource;
      if (dataSource === "add") {
        return;
      }
      if (dataSource === "dict") {
        config.dict && this.getDictData();
      }
      if (dataSource === "api") {
        config.url && config.methodType && this.getTableList();
      }
    },
    // 初始化数据
    initData() {
      if (this.dataSource === "dict") {
        this.getDictData();
      } else if (this.dataSource === "api") {
        this.getTableList();
      }
    },
    // 请求字典
    async getDictData() {
      const code = this.field.options.selectConfig.dict;
      // const { data } = await dictTree({ typeCode: code, status: 1 });
      // this.lineList = data.data;
    },
    // 请求自定义接口
    async getTableList() {
      const params = {};
      const paramsList = this.field.options.selectConfig.searchParams;
      if (paramsList.length > 0) {
        paramsList.forEach((res) => {
          params[res.label] = res.value;
        });
      }
      const backType = this.field.options.selectConfig.otherObj.backData;
      const requestType = this.field.options.selectConfig.methodType;
      let newData = {};
      if (requestType === "post") {
        newData = await request({
          url: this.VUE_APP_DESIGNER_URL + this.field.options.selectConfig.url,
          method: "post",
          data: Qs.stringify(params),
        });
      } else {
        newData = await request({
          url: this.VUE_APP_DESIGNER_URL + this.field.options.selectConfig.url,
          method: "get",
          params: {
            ...params,
          },
        });
      }

      if (backType !== "") {
        backType.split(".").forEach((res) => {
          newData = newData[res];
          debugger;
        });
      }
      if (this.field.options.selectConfig.otherObj.backMethod) {
        const resetMethed = eval(
          `(${this.field.options.selectConfig.otherObj.backMethod})`
        );
        this.lineList = resetMethed(newData);
      } else {
        this.lineList = newData;
      }
      console.log(this.lineList, 6669);
    },
  },
};
