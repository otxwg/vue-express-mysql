export const setTableListMethod = function (fop, ft, gdTableMethodList, resultList) {
  // 字段要统一
  if (fop.tableConfig.config2 === '0' && fop.tableConfig.url !== '') {
    let params = {}
    if (fop.tableConfig.config4 !== '') {
      params = JSON.parse(fop.tableConfig.config4)
    }
    if (fop.tableSearchData.length > 0) {
      fop.tableSearchData.forEach((res) => {
        params[res.label] = res.value
      })
    }
    let strTotal = ''
    const totalType = fop.otherConfig.totalName || 'data.total'
    if (fop.otherConfig.isPage) {
      resultList.push(`${fop.name}Total: 0,`)
      resultList.push(`${fop.name}Current: ${fop.otherConfig.currentValue},`)
      resultList.push(`${fop.name}Size: ${fop.otherConfig.sizeValue},`)
      params[fop.otherConfig.currentName] = fop.otherConfig.currentValue
      params[fop.otherConfig.sizeName] = fop.otherConfig.sizeValue
      resultList.push(`${fop.name}Params: ${JSON.stringify(params)},`)
      strTotal = `this.${fop.name}Total = resData.${totalType}`
    }
    let backMethodArr = []
    let backMethod = fop.tableConfig.configMethod
    if (backMethod !== '') {
      backMethod = backMethod.replace('function ', '')
      backMethodArr = backMethod.split('(')
    }
    const backData = fop.tableConfig.config5 || 'data.records'
    const strData = backMethod === '' ? `this.tableData${fop.name} = resData.${backData}` : `this.tableData${fop.name} = this.${backMethodArr[0]}(resData.${backData})`

    const requestType = fop.tableConfig.method
    const methodName = `${requestType === 'get' ? 'params' : 'data'} `
    let tablePage = ``
    let commonParams = ``
    if (fop.otherConfig.isPage) {
      commonParams = `...this.${fop.name}Params,...this.formData`
      tablePage = `${fop.otherConfig.currentName}: this.${fop.name}Current, ${fop.otherConfig.sizeName}: this.${fop.name}Size`
    } else {
      commonParams = `...this.formData`
      tablePage = ``
    }
    const dataVal = requestType === 'get' ? `{${commonParams}, ${tablePage}}` : `this.qsMethod.stringify(${`{${commonParams}, ${tablePage}}`})`
    const fun = `async ${fop.name}Method(page = ''){
        if(page !== '') {
          this.${fop.name}Current = page
        }
        const resData = await this.requestMethod({
          url: '${fop.tableConfig.url}',
          method: '${requestType}',
          ${methodName}: ${dataVal}
        })
        ${strData}
        ${strTotal}

     }`
    const pageFun = `async initTable${fop.name}({ page, limit }){
        this.${fop.name}Current = page
        this.${fop.name}Size = limit
        await this.${fop.name}Method()
      }`
    gdTableMethodList.push({
      methodName: `${fop.name}Method`,
      methodFun: fun,
      backMethod: backMethod === '' ? '' : `${backMethod}`,
      pageMethod: fop.otherConfig.isPage ? pageFun : '',
      noMounted: fop.otherConfig.isTableAuto
    })
    // 处理自动计算所要的条数
    if (fop.otherConfig.isTableAuto) {
      const getReallySize = `${fop.name}getReallySize(val){
        this.${fop.name}Size = val
        this.${fop.name}Method()
      }`
      gdTableMethodList.push({
        methodName: `${fop.name}getReallySize`,
        methodFun: getReallySize,
        noMounted: true
      })
    }
    getTableColumnMethod(fop, ft, gdTableMethodList, resultList)
  }
}
function getTableColumnMethod(fop, ft, gdTableMethodList, resultList) {
  const arrList = fop.tableColumn || []

  arrList.forEach((item) => {
    const propsCode = item.compJavascript
    if (propsCode && propsCode !== '') {
      const jsCode = eval(`(${propsCode})`)

      if (Object.keys(jsCode.methods).length !== 0) {
        for (let i in jsCode.methods) {
          gdTableMethodList.push({
            methodName: i,
            methodFun: jsCode.methods[i].toString(),
            backMethod: '',
            pageMethod: '',
            noMounted: true
          })
        }
      }
      if (Object.keys(jsCode.data()).length !== 0) {
        for (let i in jsCode.data()) {
          resultList.push({
            i: jsCode.data()[i]
          })
        }
      }
    }
  })
}
