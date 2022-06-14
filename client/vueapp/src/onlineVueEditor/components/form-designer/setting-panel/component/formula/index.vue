<template>
  <div>
    <gd-dialog
      :title="'弹框'"
      :size="size"
      :z-index="2002"
      :closed.sync="prinftShow"
      :append-to-body="true"
      width="800px"
      height="850px"
      draggable
      maximizable
      :maximized.sync="maximized"
    >
      <div title="可拖动改变位置" ref="drop" class="dropFormula">
        <draggableRight v-model="listOrder" v-bind="dragOptions" handle=".header">
          <transition-group :name="'flip-list'" type="transition">
            <el-tag
              closable=""
              style="margin: 2px 0px; cursor: pointer"
              v-for="(tag, index) in listOrder"
              :key="tag.name + index"
              :type="tag.type"
              class="header"
              @click="clickOrderTag(tag, index)"
              @close="closeTag(tag.mainType, index)"
            >
              <span>{{ tag.name }}</span>
            </el-tag>
          </transition-group>
        </draggableRight>
      </div>
      <div class="tag-group" style="margin-top: 5px">
        <span class="tag-group__title">计算符号</span>
        <el-button style="margin: 2px 2px; cursor: pointer" size="mini" v-for="item in items" :key="item.label" type="primary" plain @click="addFile({ name: item.label }, true)">
          {{ item.label }}
        </el-button>
      </div>
      <div class="tag-group" style="margin-top: 5px">
        <span class="tag-group__title">数字输入</span>
        <el-input-number size="small" v-model="numData" label="数字输入"></el-input-number>
        <el-button style="margin: 2px 2px; cursor: pointer" size="mini" type="primary" plain @click="addFile({ name: numData }, true)"> 添加 </el-button>
      </div>
      <el-tabs type="border-card" style="margin-top: 8px">
        <el-tab-pane v-for="(item, index) in dataList" :key="index" :label="item.tableType === 'main' ? `${item.comment}(主表)` : item.comment">
          <div>
            <gd-table ref="gdtable" height="450px" :columns="tableColumn" :data="item.sysBoAttrs" :border="true" style="margin-top: 10px; margin-bottom: 10px">
              <template slot="caozuo" slot-scope="scope">
                <!-- v-if="item.genTable !== 'yes'" -->
                <el-select v-if="item.tableType !== 'main'" clearable v-model="scope.row.sumdata" placeholder="请选择计算函数" size="small" style="width: 200px">
                  <el-option v-for="item in sumlist" :key="item.value" :label="item.label" :value="item.value">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                  </el-option>
                </el-select>
                <el-button v-if="item.tableType !== 'main'" type="text" size="small" @click="addFileChild(scope.row, item.name)">添加</el-button>
                <el-button v-if="item.tableType === 'main'" type="text" size="small" @click="addFile(scope.row)">添加</el-button>
              </template>
            </gd-table>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="函数">
          <div>
            <gd-table ref="gdtable" height="500px" :columns="tableColumnMethod" :data="dataList" :border="true" style="margin-top: 10px; margin-bottom: 10px">
              <template slot="caozuo">
                <el-button type="text" size="small">添加</el-button>
              </template>
            </gd-table>
          </div>
        </el-tab-pane> -->
      </el-tabs>
      <template slot="footer">
        <div>
          <el-button size="small" type="primary" @click="submit">确定</el-button>
          <el-button size="small" @click="prinftShow = false">取消</el-button>
        </div>
      </template>
    </gd-dialog>
  </div>
</template>

<script>
import draggableRight from 'vuedraggable'
export default {
  name: 'el-sliddelete',
  data() {
    return {
      formdata: [],
      sumlist: [
        {
          value: 'gdMethodSum',
          label: '求和'
        },
        {
          value: 'gdMethodAvg',
          label: '平均值'
        },
        {
          value: 'gdMethodMax',
          label: '最大值'
        },
        {
          value: 'gdMethodMin',
          label: '最小值'
        }
      ],
      selectedWidget: {},
      numData: '',
      items: [
        { type: '', label: '+' },
        { type: 'success', label: '-' },
        { type: 'success', label: '*' },
        { type: 'success', label: '%' },
        { type: 'success', label: '/' },
        { type: 'success', label: '(' },
        { type: 'success', label: ')' }
      ],
      listOrder: [],
      dataList: [],
      tableColumn: [
        { prop: 'name', width: '200px', label: '字段名', align: 'center' },
        { prop: 'comment', width: '200px', label: '字段值', align: 'center' },
        { prop: 'caozuo', label: '操作', align: 'center' }
      ],
      tableColumnMethod: [
        { prop: 'name', label: '函数名', width: '200px', align: 'center' },
        { prop: 'comment', label: '函数功能', align: 'center' },
        { prop: 'caozuo', label: '操作', align: 'center', width: '150px' }
      ],
      prinftShow: false,
      maximized: false,
      textarea: '',
      size: 'default'
    }
  },
  components: {
    draggableRight
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  mounted() {},
  methods: {
    submit() {
      // let that = this.selectedWidget
      if (this.listOrder.length > 0) {
        const listOrder = this.listOrder.map((res) => {
          return res.name
        })
        const formula = `#{${this.selectedWidget.id}}=` + listOrder.join('')
        this.$set(this.selectedWidget.options, 'formula', formula)
        this.$set(this.selectedWidget.options, 'formulaarr', JSON.stringify(this.listOrder))
        this.prinftShow = false
      }
    },
    addFileChild(row, name) {
      if (!row.sumdata || row.sumdata === '') {
        this.$message.warning('函数不能为空')
        return
      }
      this.listOrder.push({ name: `#{${row.sumdata}_${name}_${row.name}}`, type: 'success' })
    },
    addFile(row, type = false) {
      this.listOrder.push({ name: type ? row.name : `#{${row.name}}`, type: type ? '' : 'success' })
    },
    closeTag(type, index) {
      this.listOrder.splice(index, 1)
    },
    clickOrderTag(tag, index) {},
    textareaMethod() {},
    handelOpen(metadata, _this) {
      this.selectedWidget = _this
      this.prinftShow = true
      this.dataList = metadata
      if (this.selectedWidget.options.formulaarr && this.selectedWidget.options.formulaarr !== '') {
        this.listOrder = JSON.parse(this.selectedWidget.options.formulaarr)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .el-tag {
    background-color: transparent;
    border-color: transparent;
    padding: 0;
    .el-tag__close {
      display: none;
    }
  }
  .dropFormula .el-tag:hover {
    background-color: #ecf5ff;
    border-color: #b3d8ff;
    padding: 0 5px;
    .el-tag__close {
      display: inline-block;
    }
  }
  .el-tag.el-tag--success {
    background-color: transparent;
    border-color: transparent;
    color: #67c23a;

    .el-tag__close {
      display: none;
    }
  }
  .el-tag.el-tag--success:hover {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    padding: 0 5px;
    .el-tag__close {
      display: inline-block;
    }
  }
}
.dropFormula {
  min-height: 36px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
