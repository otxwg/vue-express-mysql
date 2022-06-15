import Vue from 'vue'

/**
 * 格式说明：属性名称==对应属性编辑器的组件名称
 */
const COMMON_PROPERTIES = {
  //字段
  name: 'name-editor',
  label: 'label-editor',
  labelAlign: 'labelAlign-editor',

  columnWidth: 'columnWidth-editor',
  size: 'size-editor',
  showStops: 'showStops-editor',

  textContent: 'textContent-editor',
  htmlContent: 'htmlContent-editor',

  uploadURL: 'uploadURL-editor',
  uploadTip: 'uploadTip-editor',

  fileMaxSize: 'fileMaxSize-editor',
  fileTypes: 'fileTypes-editor',

  iframeform: 'iframeform-editor',

  //容器
  showBlankRow: 'showBlankRow-editor',
  showRowNumber: 'showRowNumber-editor',
  cellWidth: 'cellWidth-editor',
  cellHeight: 'cellHeight-editor',
  colHeight: 'colHeight-editor',
  othersTable: 'othersTable-editor',
  gdTable: 'gdTable-editor',
  gdDialog: 'gdDialog-editor',
  gdEchart: 'gdEchart-editor',
  gutter: 'gutter-editor',
  responsive: 'responsive-editor',
  span: 'span-editor',
  offset: 'offset-editor',
  push: 'push-editor',
  pull: 'pull-editor'
}

const ADVANCED_PROPERTIES = {
  min: 'min-editor',
  max: 'max-editor',
  precision: 'precision-editor',
  step: 'step-editor',
  controlsPosition: 'controlsPosition-editor',
  minLength: 'minLength-editor',
  maxLength: 'maxLength-editor',
  showWordLimit: 'showWordLimit-editor',
  prefixIcon: 'prefixIcon-editor',
  suffixIcon: 'suffixIcon-editor',
  openIcon: 'openIcon-editor',
  closeIcon: 'closeIcon-editor',
  switchWidth: 'switchWidth-editor',
  activeText: 'activeText-editor',
  inactiveText: 'inactiveText-editor',
  activeColor: 'activeColor-editor',
  inactiveColor: 'inactiveColor-editor',
  lowThreshold: 'lowThreshold-editor',
  highThreshold: 'highThreshold-editor',
  allowHalf: 'allowHalf-editor',
  showText: 'showText-editor',
  showScore: 'showScore-editor',
  range: 'range-editor',
  vertical: 'vertical-editor',
  plain: 'plain-editor',
  round: 'round-editor',
  circle: 'circle-editor',
  icon: 'icon-editor',
  labelIconClass: 'labelIconClass-editor',
  labelIconPosition: 'labelIconPosition-editor',
  labelTooltip: 'labelTooltip-editor',
  appendButton: 'appendButton-editor',
  appendButtonDisabled: 'appendButtonDisabled-editor',
  buttonIcon: 'buttonIcon-editor'
}

const EVENT_PROPERTIES = {
  //字段
  onCreated: 'onCreated-editor',
  onMounted: 'onMounted-editor',
  onClick: 'onClick-editor',
  onCustomize: 'onCustomize-editor',
  onInput: 'onInput-editor',
  onChange: 'onChange-editor',
  onFocus: 'onFocus-editor',
  onBlur: 'onBlur-editor',
  onRemoteQuery: 'onRemoteQuery-editor',
  onBeforeUpload: 'onBeforeUpload-editor',
  onUploadSuccess: 'onUploadSuccess-editor',
  onUploadError: 'onUploadError-editor',
  onValidate: 'onValidate-editor',

  //容器
  onSubFormRowAdd: 'onSubFormRowAdd-editor',
  onSubFormRowInsert: 'onSubFormRowInsert-editor',
  onSubFormRowDelete: 'onSubFormRowDelete-editor',
  onSubFormRowChange: 'onSubFormRowChange-editor'
}
// 数据设置属性
export const DATA_SETTING_PROPERTIES = {
  dataType: 'dataType-editor',
  type: 'type-editor',
  format: 'format-editor',
  valueFormat: 'valueFormat-editor',
  optionItems: 'optionItems-editor',
  rows: 'rows-editor',
  showPassword: 'showPassword-editor',
  fromwheretwo: 'fromwheretwo-editor',
  // editFlow: 'editFlow-editor',
  // fromwheretwo: 'fromwheretwo-editor',
  defaultValue: 'defaultValue-editor',
  placeholder: 'placeholder-editor',
  startPlaceholder: 'startPlaceholder-editor',
  endPlaceholder: 'endPlaceholder-editor',
  validation: 'validation-editor',
  validationHint: 'validationHint-editor'
}
// 排版属性
export const WORD_TYPE_PROPERTIES = {
  wordType: 'wordType-editor'
}

// 编辑权限属性
export const EDIT_ACCESS_PROPERTIES = { editFlow: 'editFlow-editor' }
// 样式设置属性
export const STYLE_PROPERTIES = {
  labelWidth: 'labelWidth-editor',
  border: 'border-editor',
  headerBackground: 'headerBackground-editor',
  bodyBackground: 'bodyBackground-editor',
  showSearchFolded: 'showSearchFolded-editor',
  boxConfig: 'el-box-container-editor',
  displayStyle: 'displayStyle-editor',
  buttonStyle: 'buttonStyle-editor',
  marginPadding: 'marginPadding-editor',
  customClass: 'customClass-editor'
}
// 其它设置属性
export const OTHERS_SETTING_PROPERTIES = {
  required: 'required-editor',
  readonly: 'readonly-editor',
  disabled: 'disabled-editor',
  hidden: 'hidden-editor',
  clearable: 'clearable-editor',
  editable: 'editable-editor',
  labelHidden: 'labelHidden-editor',
  filterable: 'filterable-editor',
  allowCreate: 'allowCreate-editor',
  remote: 'remote-editor',
  automaticDropdown: 'automaticDropdown-editor',
  multiple: 'multiple-editor',
  multipleLimit: 'multipleLimit-editor',
  contentPosition: 'contentPosition-editor',
  withCredentials: 'withCredentials-editor',
  checkStrictly: 'checkStrictly-editor',
  multipleSelect: 'multipleSelect-editor',
  limit: 'limit-editor'
}

/**
 * 注册组件常见属性
 * 如属性编辑器的组件名称propEditorName设置为null，则不显示该属性编辑器！！
 * @param uniquePropName 属性名称（保证名称唯一，不跟其他组件属性冲突）
 * @param propEditorName 对应属性编辑器的组件名称
 */
export function registerCommonProperty(uniquePropName, propEditorName) {
  COMMON_PROPERTIES[uniquePropName] = propEditorName
}
/**
 * 注册组件常见属性
 * 如属性编辑器的组件名称propEditorName设置为null，则不显示该属性编辑器！！
 * @param uniquePropName 属性名称（保证名称唯一，不跟其他组件属性冲突）
 * @param propEditorName 对应属性编辑器的组件名称
 */
export function registerStyleProperty(uniquePropName, propEditorName) {
  STYLE_PROPERTIES[uniquePropName] = propEditorName
}

/**
 * 注册组件高级属性
 * 如属性编辑器的组件名称propEditorName设置为null，则不显示该属性编辑器！！
 * @param uniquePropName 属性名称（保证名称唯一，不跟其他组件属性冲突）
 * @param propEditorName 对应属性编辑器的组件名称
 */
export function registerAdvancedProperty(uniquePropName, propEditorName) {
  ADVANCED_PROPERTIES[uniquePropName] = propEditorName
}
/**
 * 注册数据设置属性
 * 如属性编辑器的组件名称propEditorName设置为null，则不显示该属性编辑器！！
 * @param uniquePropName 属性名称（保证名称唯一，不跟其他组件属性冲突）
 * @param propEditorName 对应属性编辑器的组件名称
 */
export function registerDataSettingProperty(uniquePropName, propEditorName) {
  DATA_SETTING_PROPERTIES[uniquePropName] = propEditorName
}
// 排版
export function registerWordTypeProperty(uniquePropName, propEditorName) {
  WORD_TYPE_PROPERTIES[uniquePropName] = propEditorName
}

/**
 * 注册组件数据权限属性
 * 如属性编辑器的组件名称propEditorName设置为null，则不显示该属性编辑器！！
 * @param uniquePropName 属性名称（保证名称唯一，不跟其他组件属性冲突）
 * @param propEditorName 对应属性编辑器的组件名称
 */
export function registerAccessProperty(uniquePropName, propEditorName) {
  EDIT_ACCESS_PROPERTIES[uniquePropName] = propEditorName
}
/**
 * 注册其他属性
 * 如属性编辑器的组件名称propEditorName设置为null，则不显示该属性编辑器！！
 * @param uniquePropName 属性名称（保证名称唯一，不跟其他组件属性冲突）
 * @param propEditorName 对应属性编辑器的组件名称
 */
export function registerOtherSettingProperty(uniquePropName, propEditorName) {
  OTHERS_SETTING_PROPERTIES[uniquePropName] = propEditorName
}

/**
 * 注册组件事件属性
 * 如属性编辑器的组件名称propEditorName设置为null，则不显示该属性编辑器！！
 * @param uniquePropName 属性名称（保证名称唯一，不跟其他组件属性冲突）
 * @param propEditorName 对应属性编辑器的组件名称
 */
export function registerEventProperty(uniquePropName, propEditorName) {
  EVENT_PROPERTIES[uniquePropName] = propEditorName
}

/**
 * 注册常见属性对应的属性编辑器
 * @param uniquePropName
 * @param propEditorName
 * @param editorComponent
 */
export function registerCPEditor(uniquePropName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerCommonProperty(uniquePropName, propEditorName)
}

/**
 * 注册样式属性对应的属性编辑器
 * @param uniquePropName
 * @param propEditorName
 * @param editorComponent
 */
export function registerStyleEditor(uniquePropName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerStyleProperty(uniquePropName, propEditorName)
}
/**
 * 注册高级属性对应的属性编辑器
 * @param uniquePropName
 * @param propEditorName
 * @param editorComponent
 */
export function registerAPEditor(uniquePropName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerAdvancedProperty(uniquePropName, propEditorName)
}
/**
 * 注册数据设置对应的属性编辑器
 * @param uniquePropName
 * @param propEditorName
 * @param editorComponent
 */
export function registerDSEditor(uniquePropName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerDataSettingProperty(uniquePropName, propEditorName)
}

export function registerWtypeEditor(uniquePropName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerWordTypeProperty(uniquePropName, propEditorName)
}

/**
 * 注册权限属性对应的属性编辑器
 * @param uniquePropName
 * @param propEditorName
 * @param editorComponent
 */
export function registerACditor(uniquePropName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerAccessProperty(uniquePropName, propEditorName)
}
/**
 * 注册权限属性对应的属性编辑器
 * @param uniquePropName
 * @param propEditorName
 * @param editorComponent
 */
export function registerOTditor(uniquePropName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerOtherSettingProperty(uniquePropName, propEditorName)
}

/**
 * 注册事件属性对应的属性编辑器
 * @param uniquePropName
 * @param propEditorName
 * @param editorComponent
 */
export function registerEPEditor(uniquePropName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerEventProperty(uniquePropName, propEditorName)
}

export default {
  COMMON_PROPERTIES,
  ADVANCED_PROPERTIES,
  EVENT_PROPERTIES,
  EDIT_ACCESS_PROPERTIES,
  OTHERS_SETTING_PROPERTIES,
  DATA_SETTING_PROPERTIES,
  STYLE_PROPERTIES,
  WORD_TYPE_PROPERTIES
}
