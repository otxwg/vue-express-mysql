<template>
  <div>
    <el-form-item :label="'td文本'">
      <el-input type="text" v-model="selectedWidget.initValue"></el-input>
    </el-form-item>
    <el-form-item :label="'背景颜色'">
      <el-color-picker v-model="optionModel.commonBg"></el-color-picker>
    </el-form-item>
    <el-form-item :label="'字体颜色'">
      <el-color-picker v-model="optionModel.commonColor"></el-color-picker>
    </el-form-item>
    <el-form-item :label="'字体大小'">
      <el-select v-model="optionModel.commonSize" placeholder="请选择">
        <el-option v-for="item in optionsSize" :key="item.value" :label="item.label" :value="item.value">
          <span :style="{ fontSize: item.value }">{{ item.label }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="'字体加粗'">
      <el-select v-model="optionModel.commonWeight" placeholder="请选择">
        <el-option v-for="item in optionsWeight" :key="item.value" :label="item.label" :value="item.value">
          <span :style="{ fontWeight: item.value }">{{ item.label }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="'边框大小'">
      <el-input type="text" v-model="optionModel.commonBorderWidth"></el-input>
    </el-form-item>
    <el-form-item :label="'边框颜色'">
      <el-color-picker v-model="optionModel.commonBorderType"></el-color-picker>
    </el-form-item>
    <el-form-item :label="'水平位置'">
      <el-select v-model="optionModel.commonCenter" placeholder="请选择">
        <el-option v-for="item in optionsCenter" :key="item.value" :label="item.label" :value="item.value">
          <span :style="{ fontWeight: item.value }">{{ item.label }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="'垂直位置'">
      <el-select v-model="optionModel.commonVer" placeholder="请选择">
        <el-option v-for="item in optionsVer" :key="item.value" :label="item.label" :value="item.value">
          <span :style="{ fontWeight: item.value }">{{ item.label }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="'样式修改'">
      <el-button type="primary" size="small" @click="addCss">编写css</el-button>
    </el-form-item>
    <el-form-item :label="'单元格宽度'">
      <el-input type="number" v-model="optionModel.cellWidth">
        <template slot="suffix">
          px
        </template>
      </el-input>
    </el-form-item>

    <gd-dialog :title="'样式修改'" size="small" :z-index="2001" :closed.sync="showDialog" :append-to-body="true" draggable :maximized.sync="maximized" width="800px">
      <span style="color: red">提示：红色x是编辑器问题不影响代码编写，这里针对的是单个td的样式修改，会覆盖全局的样式</span>
      <code-editor :mode="'css'" :readonly="false" v-model="optionModel.cellStyle" style="margin-top: 10px"></code-editor>
      <template slot="footer">
        <div>
          <el-button size="small" @click="showDialog = false">关闭</el-button>
        </div>
      </template>
    </gd-dialog>
  </div>
</template>

<script>
import i18n from '../../../../../utils/i18n'
import CodeEditor from '../../../../code-editor/index'
export default {
  name: 'cellWidth-editor',
  components: { CodeEditor },
  mixins: [i18n],
  data() {
    return {
      maximized: false,
      showDialog: false,
      optionsWeight: [
        {
          value: 'normal',
          label: '正常'
        },
        {
          value: 'bold',
          label: '加粗'
        }
      ],
      optionsVer: [
        {
          value: 'middle',
          label: '居中'
        },
        {
          value: 'top',
          label: '靠顶'
        },
        {
          value: 'bottom',
          label: '靠底'
        }
      ],
      optionsCenter: [
        {
          value: 'center',
          label: '居中'
        },
        {
          value: 'left',
          label: '靠左'
        },
        {
          value: 'right',
          label: '靠右'
        }
      ],
      optionsSize: [
        {
          value: '10px',
          label: '10px'
        },
        {
          value: '11px',
          label: '11px'
        },
        {
          value: '12px',
          label: '12px'
        },
        {
          value: '14px',
          label: '14px'
        },
        {
          value: '16px',
          label: '16px'
        },
        {
          value: '18px',
          label: '18px'
        },
        {
          value: '20px',
          label: '20px'
        },
        {
          value: '24px',
          label: '24px'
        },
        {
          value: '36px',
          label: '36px'
        }
      ]
    }
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  methods: {
    addCss() {
      this.showDialog = true
    },
    onSubmit() {}
  }
}
</script>

<style scoped></style>
