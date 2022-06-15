export const setSearchMethod = function (fop, ft, resultList, fieldWidget) {
  // 设置字段
  resultList.push(`${fop.name}Dialog: ${fieldWidget.options.showSearchFolded || false},`)
  resultList.push(`showSearch: ${fieldWidget.options.showSearchFolded || false},`)
}

export const setGdSearchFormData = function (fieldWidget, gdTableDefaultValue, resultList) {
  // console.log(fieldWidget)
  fieldWidget.rows.forEach((row) => {
    row.cols.forEach((col) => {
      col.widgetList.forEach((item) => {
        resultList.push(`${item.id}: '',`)
        if (['select', 'radio', 'ascader', 'cascader', 'checkbox'].includes(item.type)) {
          const option = item.options.optionItems
          gdTableDefaultValue.push(`${item.id}Options:` + JSON.stringify(option) + ',')
        }
      })
    })
  })
}
