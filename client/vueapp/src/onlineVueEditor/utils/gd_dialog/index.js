export const setDialogMethod = function (fop, ft, resultList, fieldWidget, defaultValueList, commonMethodList) {
  // 设置字段

  resultList.push(`${fop.name}Dialog: false,`)
  if (fieldWidget.rows.length > 0) {
    for (let i = 0; i < fieldWidget.rows.length; i++) {
      defaultValueList.push(`${fieldWidget.rows[i].options.name}: '',`)
      if (fieldWidget.rows[i].options.optionItems) {
        resultList.push(`${fieldWidget.rows[i].options.name}Options: ${JSON.stringify(fieldWidget.rows[i].options.optionItems)},`)
      }
    }
  }
  fop.dialogConfig.btnFooterList.forEach(item => {
    if (item.onCustomClickHandler && item.id) {
      // 获取方法名
      const method = `async onCustomHandler${item.id}() { ${item.onCustomClickHandler} }`
      commonMethodList.push({
        methodName: `onCustomHandler${item.id}`,
        methodFun: method,
        backMethod: '',
        pageMethod: '',
        noMounted: true
      })
    }
  })
}
