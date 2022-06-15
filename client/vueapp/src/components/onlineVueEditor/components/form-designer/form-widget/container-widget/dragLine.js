export const dragLine = {
  cellCursor: '',
  containers: [],
  designer: null,
  startEvent: {
    x: 0,
    y: 0
  },
  thisRow: null,
  timeOut:null,
  tdNum: [],
  setTableStyle: function (colgroup, tr) {
    dragLine.deleteBox('el-drag-line')
    dragLine.designer.widgetList.forEach(item => {
      if (item?.type === 'table') {
        item.colGroup = []
        // 列表宽度
        for (let t = 0; t < colgroup.length; t++) {
          item.colGroup.push({
            width: colgroup[t].width
          })
        }
        // 行高度
        if (tr?.style?.height) {
          item.rows[tr.rowIndex]['cellHeight'] = tr.style.height
        }
      }
    })
  },
  // 获取box的距离屏幕的距离
  getXY: function (element) {
    let x = 0
    let  y = 0
    if (element?.offsetParent) {
      while (element.offsetParent) {
        y += element.offsetTop
        x += element.offsetLeft
        element = element.offsetParent
      }
    }
    return { x: x, y: y }
  },
  // 删除线
  deleteBox(id) {
    const divRow = document.getElementById(id)
    if (divRow) {
      divRow.parentNode.removeChild(divRow)
    }
  },
  // 移动线
  moveDragLine(e) {
    const divRow = document.getElementById('el-drag-line')
    if (divRow) {
      if (this.cellCursor === 'row-resize') {
        divRow.style.top = e.y + 'px'
      }
      if (this.cellCursor === 'col-resize') {
        divRow.style.left = e.x + 'px'
      }
    }
  },
  // 获取编辑器el-form-widget-main卷上去的高度
  elFormWidgetMainScrollTop() {
    return document.getElementById('el-form-widget-main').scrollTop
  },
  // 创建线
  createDragLine(table, row) {
    dragLine.deleteBox('el-drag-line')
    // 按下的初始时间
    const timeStart = new Date().getTime();
    dragLine.thisRow = row
    dragLine.startEvent = {x: event.x, y: event.y}
    dragLine.timeOut = setInterval(function () {
      const timeEnd = new Date().getTime();
      //如果此时检测到的时间与第一次获取的时间差有1000毫秒
      if (timeEnd - timeStart > 600) {
        clearInterval(dragLine.timeOut);
        if (dragLine.cellCursor) {
          const divRow = document.createElement('div')
          divRow.setAttribute('id', 'el-drag-line')
          const tableGetXY = dragLine.getXY(table)
          // 卷上去的高度
          const offY = dragLine.elFormWidgetMainScrollTop()
          if (dragLine.cellCursor === 'row-resize') {
            divRow.setAttribute('style', `z-index: 9998;width:${table.clientWidth}px;height: 2px;background: #409EFF;position: fixed;top:${dragLine.startEvent.y}px;left:${tableGetXY.x}px`)
          } else {
            divRow.setAttribute('style', `z-index: 9998;width:2px;height: ${table.clientHeight}px;background: #409EFF;position: fixed;top:${tableGetXY.y - offY}px;left:${dragLine.startEvent.x}px`)
          }
          table.parentElement.appendChild(divRow)
        }
        //便不再继续重复此函数 （clearInterval取消周期性执行）
        // dragLine.$message.info('长按了0.5秒')
      }
    }, 200)
  },
  mouseFun(table, row) {
    // document.onmousedown = function () {
    // };
    document.onmouseup = function () {
      const divRow = document.getElementById('el-drag-line')
      clearInterval(dragLine.timeOut);
      if (divRow && dragLine.cellCursor === 'row-resize') {
        dragLine.cellCursor = ''
        let pageY = event.y - dragLine.startEvent.y
        const rowHeight = dragLine.thisRow.parentElement.offsetHeight
        if ((pageY + rowHeight) < 0) {
          pageY = 0
        }
        dragLine.thisRow.parentElement.style.height = rowHeight + pageY + 'px'
        dragLine.setTableStyle(table.children[0].children, dragLine.thisRow.parentElement)
      }
      if (divRow && dragLine.cellCursor === 'col-resize') {
        dragLine.cellCursor = ''
        const tableGetXY = dragLine.getXY(table)
        const nextSiblingXY = dragLine.getXY(dragLine.thisRow.nextElementSibling)
        let pageX = event.x - dragLine.startEvent.x
        const colgroup = table.children[0].children
        // 总长度
        let countColWidth = 0
        // 计算当前位置长度
        let knowRowIsWhere = 0
        let isRow = 0
        let widthList = []
        let isFalse = false
        for (let i = 0; i < colgroup.length; i++) {
          countColWidth += colgroup[i].clientWidth
          widthList.push(colgroup[i].clientWidth)
          if ((colgroup.length - 1) > i) {
            knowRowIsWhere = countColWidth + colgroup[i + 1].clientWidth
          }
          if (!isFalse && !isRow) {
            if ((tableGetXY.x + knowRowIsWhere) > nextSiblingXY.x) {
              isRow = i
              isFalse = true
            }
          }
        }
        widthList[isRow] += pageX
        widthList[isRow + 1] -= pageX
        for (let h = 0; h < colgroup.length; h++) {
          colgroup[h].width = ((widthList[h] / countColWidth) * 100).toFixed(2) + '%'
        }
        dragLine.setTableStyle(table.children[0].children, dragLine.thisRow.parentElement)
      }
      // 清除定时器
      // clearInterval(dragLine.timeOut)
    };
    document.onmousemove = function () {
      dragLine.moveDragLine(event)
    }
  },
  // 鼠标移入table边框border光标的变形状态
  tableCellBorder() {
    const tableList = document.getElementsByClassName('table-layout')
    for (let t = 0; t < tableList.length; t++) {
      const tableTest = tableList[t]
      dragLine.tdNum[t] = 0
      if (tableTest) {
        for (let i = 0; i < tableTest.rows.length; i++) {
          const row = tableTest.rows[i]
          for (let j = 0; j < row.cells.length; j++) {
            if (!i) {
              dragLine.tdNum[t] += row.cells[j].colSpan
            }
            row.cells[j].onmousedown = function () {
              dragLine.createDragLine(tableTest, row.cells[j])
              dragLine.mouseFun(tableTest, row.cells[j])
            }
            row.cells[j].onmousemove = function () {
              this.style.cursor = ''
              const divRow = document.getElementById('el-drag-line')
              if (!divRow) {
                dragLine.cellCursor = ''
              }
              if (event.offsetX > this.clientWidth - 5 && row.cells.length > (j + 1)) {
                this.style.cursor = 'col-resize';
                dragLine.cellCursor = this.style.cursor
              }
              if (event.offsetY > (this.offsetHeight - 5)) {
                this.style.cursor = 'row-resize';
                dragLine.cellCursor = this.style.cursor
              }
            }
          }
        }
      }
    }
  },
  getColNum(table, td) {
    // 总长度
    let knowRowIsWhere = 0
    let countColWidth = 0
    let isRow = 0
    let isFalse = false
    const tableGetXY = dragLine.getXY(table)
    const nextSiblingXY = dragLine.getXY(td.nextElementSibling)
    const colgroup = table.children[0].children
    const widthList = []
    for (let i = 0; i < colgroup.length; i++) {
      countColWidth += colgroup[i].clientWidth
      widthList.push(colgroup[i].clientWidth)
      if ((colgroup.length - 1) > i) {
        knowRowIsWhere = countColWidth + colgroup[i + 1].clientWidth
      }
      if ((tableGetXY.x + knowRowIsWhere) > nextSiblingXY.x && !isFalse) {
        isRow = i
        isFalse = true
      }
    }
    return {
      isRow: isRow,
      countColWidth: countColWidth,
      widthList: widthList
    }
  },
  // table本表, td此单元格所在的col，type ：删除、新增类型（左侧新增，右侧新增）{del, left, right}
  averageColgroupCol(table, type, obj) {
    const colgroup = table.children[0].children
    const parent = colgroup[obj.isRow].parentNode;
    if (type === 'del') {
      for (let i = 0; i < colgroup.length; i++) {
        colgroup[i].width = (Number(colgroup[i].width.replace('%', '')) * (colgroup.length / (colgroup.length - 1))).toFixed(2) + '%'
      }
      parent.removeChild(colgroup[obj.isRow])
    } else {
      let colDome = document.createElement('col')
      const colWidth = (100 / (colgroup.length + 1)).toFixed(2) + '%'
      colDome.setAttribute('width', colWidth)
      for (let j = 0; j < colgroup.length; j++) {
        const item = colgroup[j]
        const widthP = Number(item.width.replace('%', ''))
        item.width = (widthP * (colgroup.length / (colgroup.length + 1))).toFixed(2) + '%'
      }
      if (type === 'left') {
        parent.insertBefore(colDome, colgroup[obj.isRow]);
      } else {
        dragLine.insertAfter(colDome, colgroup[obj.isRow])
      }
    }
    dragLine.tableCellBorder()
  },
  insertAfter(newElement, targetElement){
    const parent = targetElement.parentNode;
    if (parent.lastChild === targetElement) {
      // 如果最后的节点是目标元素，则直接添加。因为默认是最后
      parent.appendChild(newElement);
    } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
      //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
    }
  },
  containersIn(designer) {
    dragLine.designer = designer
  }
}
