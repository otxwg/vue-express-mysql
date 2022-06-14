import { deepClone, generateId, overwriteObj } from "../../utils/util";
import {
  containers,
  advancedFields,
  basicFields,
  customFields,
} from "./widget-panel/widgetsConfig.js";
// import { VARIANT_FORM_VERSION } from '../../utils/config'

export function createDesigner(vueInstance) {
  let defaultFormConfig = {
    modelName: "formData",
    refName: "vForm",
    rulesName: "rules",
    labelWidth: 80,
    labelPosition: "left",
    size: "",
    labelAlign: "label-left-align",
    cssCode: "",
    customClass: "",
    functions: "",
    layoutType: "PC",
    onFormCreated: "",
    onFormMounted: "",
    onFormDataChange: "",
  };
  return {
    widgetList: [],
    formConfig: { cssCode: "" },

    selectedId: null,
    selectedWidget: null,
    selectedWidgetName: null, //选中组件名称（唯一）
    vueInstance: vueInstance,

    formWidget: null, //表单设计容器

    cssClassList: [], //自定义样式列表

    historyData: {
      index: -1, //index: 0,
      maxStep: 20,
      steps: [],
    },

    initDesigner(decpData = "") {
      this.widgetList = [];
      this.formConfig = deepClone(defaultFormConfig);
      // 如果没有保存过或者是编辑状态，则使用localstore的数据
      if (decpData !== "") {
        const editData = JSON.parse(decpData);
        this.widgetList = editData.widgetList;
        overwriteObj(this.formConfig, editData.formConfig);
      } else {
        this.initHistoryData();
      }
    },

    clearDesigner(skipHistoryChange) {
      let emptyWidgetListFlag = this.widgetList.length === 0;
      this.widgetList = [];
      this.selectedId = null;
      this.selectedWidgetName = null;
      this.selectedWidget = {}; //this.selectedWidget = null
      overwriteObj(this.formConfig, defaultFormConfig); //

      if (!!skipHistoryChange) {
        //什么也不做！！
      } else if (!emptyWidgetListFlag) {
        this.emitHistoryChange();
      } else {
        this.saveCurrentHistoryStep();
      }
    },

    getLayoutType() {
      return this.formConfig.layoutType || "PC";
    },

    changeLayoutType(newType) {
      this.formConfig.layoutType = newType;
    },

    getImportTemplate() {
      return {
        widgetList: [],
        formConfig: deepClone(this.formConfig),
      };
    },

    loadFormJson(formJson) {
      let modifiedFlag = false;

      if (!!formJson && !!formJson.widgetList) {
        this.widgetList = formJson.widgetList;
        modifiedFlag = true;
      }
      if (!!formJson && !!formJson.formConfig) {
        //this.formConfig = importObj.formConfig
        overwriteObj(
          this.formConfig,
          formJson.formConfig
        ); /* 用=赋值，会导致inject依赖注入的formConfig属性变成非响应式 */
        modifiedFlag = true;
      }

      return modifiedFlag;
    },

    setSelected(selected) {
      if (!selected) {
        this.clearSelected();
        return;
      }

      this.selectedWidget = selected;
      if (!!selected.id) {
        this.selectedId = selected.id;
        this.selectedWidgetName = selected.options.name;
      }
    },

    updateSelectedWidgetNameAndRef(selectedWidget, newName, newLabel) {
      this.selectedWidgetName = newName;
      //selectedWidget.options.name = newName  //此行多余
      if (
        !!newLabel &&
        Object.keys(selectedWidget.options).indexOf("label") > -1
      ) {
        selectedWidget.options.label = newLabel;
      }
    },

    clearSelected() {
      this.selectedId = null;
      this.selectedWidgetName = null;
      this.selectedWidget = {}; //this.selectedWidget = null
    },

    checkWidgetMove(evt) {
      /* Only field widget can be dragged into sub-form */
      if (!!evt.draggedContext && !!evt.draggedContext.element) {
        let wgCategory = evt.draggedContext.element.category;
        if (!!evt.to) {
          if (
            evt.to.className === "sub-form-table" &&
            wgCategory === "container"
          ) {
            //this.$message.info(this.vueInstance.i18nt('designer.hint.onlyFieldWidgetAcceptable'))
            return false;
          }
        }
      }

      return true;
    },

    insertTableRow(widget, insertPos, cloneRowIdx, isSplit = false) {
      let rowIdx = insertPos === undefined ? widget.rows.length : insertPos; //确定插入列位置
      let newRow =
        cloneRowIdx === undefined
          ? deepClone(widget.rows[widget.rows.length - 1])
          : deepClone(widget.rows[cloneRowIdx]);
      newRow.id = "table-row-" + generateId();
      newRow.merged = false;
      newRow.cols.forEach((col) => {
        col.id = "table-cell-" + generateId();
        col.options.name = col.id;
        col.merged = false;
        col.options.colspan = 1;
        col.options.rowspan = 1;
      });
      widget.rows.splice(rowIdx, 0, newRow);
      if (isSplit) {
        this.splitMethod(widget);
      }
      let colNo = 0;
      while (
        rowIdx < widget.rows.length - 1 &&
        colNo < widget.rows[0].cols.length
      ) {
        //越界判断
        let rowMerged = widget.rows[rowIdx + 1].cols[colNo].merged; //确定插入位置的单元格是否为合并单元格
        if (!!rowMerged) {
          let rowArray = widget.rows;
          let unMergedCell = {};
          let startRowIndex = null;
          for (let i = rowIdx; i >= 0; i--) {
            //查找该行已合并的主单元格
            if (
              !rowArray[i].cols[colNo].merged &&
              rowArray[i].cols[colNo].options.rowspan > 1
            ) {
              startRowIndex = i;
              unMergedCell = rowArray[i].cols[colNo];
              break;
            }
          }
          let newRowspan = unMergedCell?.options?.rowspan + 1;
          this.setPropsOfMergedRows(
            widget.rows,
            startRowIndex,
            colNo,
            unMergedCell.options.colspan,
            newRowspan
          );
          colNo += unMergedCell.options.colspan;
        } else {
          colNo += 1;
        }
      }

      this.emitHistoryChange();
    },
    splitMethod(widget, insertPos, cloneRowIdx, cols) {
      let rowIdx = insertPos === undefined ? widget.rows.length : insertPos; //确定插入列位置
      let newRow =
        cloneRowIdx === undefined
          ? deepClone(widget.rows[widget.rows.length - 1])
          : deepClone(widget.rows[cloneRowIdx]);

      newRow.id = "table-row-" + generateId();
      newRow.merged = false;
      let rowNum = 0;
      let colNum = 0;
      // let mergedList  =
      newRow.cols = [
        {
          category: "container",
          icon: "table-cell",
          id: "table-cell-" + generateId(),
          internal: true,
          merged: false,
          options: {
            name: "table-cell-" + generateId(),
            cellWidth: "",
            cellHeight: "44",
            colspan: 0,
            rowspan: 0,
            ...newRow.cols[0].options,
          },
          showInput: false,
          type: "table-cell",
          widgetList: [],
        },
      ];

      widget.rows.forEach((res, index) => {
        if (index === cloneRowIdx) {
          res.cols.forEach((item, itemIndex) => {
            if (cols === itemIndex) {
              item.options.rowspan = 0;
            } else {
              item.options.rowspan = 2;
            }
          });
        }
      });
      widget.rows.splice(rowIdx, 0, newRow);
    },

    //splitNum拆分的数量 splitType拆分的类型（行或者列）
    splitTabRowCol(widget, parentWidget, rows, cols, splitNum, splitType) {
      if (splitType === "row") {
        this.splitRow(widget, parentWidget, rows, cols, splitNum);
      }
    },
    getColsIndex(widget, parentWidget) {
      let index = -1;
      for (let i = 0; i < parentWidget.rows.length; i++) {
        const colsList = parentWidget.rows[i].cols;
        for (let y = 0; y < colsList.length; y++) {
          const item = parentWidget.rows[i].cols[y];
          if (item === widget) {
            index = y;
            break;
          }
        }
        if (index > -1) {
          break;
        }
      }
      return index;
    },
    splitRow(widget, parentWidget, rows, cols1, splitNum) {
      const cols = this.getColsIndex(widget, parentWidget);
      // 首先看拆分成多少行，并判断此单元格有多少行
      const rowspan = widget.options.rowspan;
      const colSpanList = [];
      if (rowspan <= splitNum) {
        const num = splitNum - rowspan;
        for (let k = 0; k < rowspan; k++) {
          colSpanList.push(1);
        }
        if (rowspan > 1) {
          this.splitRowOne(parentWidget, rows, cols, colSpanList, num);
        }
        for (let i = 0; i < num; i++) {
          this.addTr(widget, parentWidget, rows + i + 1, rows + i, rows);
        }
        setTimeout(() => {
          this.insertOtherTableRow(parentWidget, rows, cols, num);
        });
      } else {
        // 拆分行比例
        const num1 = rowspan % splitNum;
        const num2 = rowspan - num1;
        const num3 = num2 / splitNum;
        for (let n = 0; n < splitNum; n++) {
          colSpanList.push(num3);
        }
        for (let m = 0; m < num1; m++) {
          colSpanList[m] += 1;
        }
        this.splitRowOne(parentWidget, rows, cols, colSpanList);
      }
    },
    // 插入一行
    addTr(inWidget, widget, insertPos, cloneRowIdx, rows) {
      let rowIdx = inWidget.options.rowspan + rows; //确定插入列位置 插入位置等于（本单元格的位置rowsIndex）+ （本单元格的合并行数rowspan）
      let newRow =
        cloneRowIdx === undefined
          ? deepClone(widget.rows[widget.rows.length - 1])
          : deepClone(widget.rows[cloneRowIdx]);
      newRow.id = "table-row-" + generateId();
      newRow.merged = false;
      newRow.cols.forEach((col) => {
        col.id = "table-cell-" + generateId();
        col.options.name = col.id;
        col.merged = false;
        col.options.colspan = 1;
        col.options.rowspan = 1;
      });
      widget.rows.splice(rowIdx, 0, newRow);
      for (let i = 0; i < widget.rows.length; i++) {
        const colsList = widget.rows[i].cols;
        if (i > rowIdx - 1) {
          break;
        }
        for (let y = 0; y < colsList.length; y++) {
          const rowspan = colsList[y].options.rowspan;
          const merged = colsList[y].merged;
          if (rowspan + i > rowIdx && !merged) {
            // 超行处理，合并超行
            widget.rows[i].cols[y].options.rowspan += 1;
            // 隐藏掉合并行
            const colspan = widget.rows[i].cols[y].options.colspan - 1;
            for (let m = 0; m < colspan; m++) {
              widget.rows[rowspan + i].cols[y + m].merged = true;
            }
            // 此列合并的td都合并,除了本单元格以外的此列的合并长度的单元格都需要做空（隐藏）处理
            for (let k = i + 1; k < rowspan + i + 1; k++) {
              widget.rows[k].cols[y].merged = true;
            }
          }
          if (i > rowIdx - 1) {
            break;
          }
        }
      }
    },
    insertOtherTableRow(parentWidget, rows, cols, num) {
      for (let i = 0; i < parentWidget.rows.length; i++) {
        if (i > rows) {
          break;
        }
        const colsList = parentWidget.rows[i].cols;
        for (let y = 0; y < colsList.length; y++) {
          const item = colsList[y].options.rowspan;
          if (item + i === rows + 1 && y !== cols) {
            const merged = parentWidget.rows[i].cols[y].merged;
            if (!merged) {
              const rowspan = parentWidget.rows[i].cols[y].options.rowspan;
              parentWidget.rows[i].cols[y].options.rowspan += num;
              const colspan = parentWidget.rows[i].cols[y].options.colspan;
              // 行隐藏
              for (let o = 0; o < num + 1; o++) {
                // rowspan + i + o - 1
                // 下一行单元格是否需要隐藏行
                for (let j = 0; j < colspan; j++) {
                  if (rowspan === 1 && !o && !j) {
                    parentWidget.rows[rowspan + i + o - 1].cols[
                      y + j
                    ].merged = false;
                  } else {
                    parentWidget.rows[rowspan + i + o - 1].cols[
                      y + j
                    ].merged = true;
                  }
                }
              }
            }
          }
        }
      }
    },
    splitRowOne(parentWidget, rows, cols, colSpanList) {
      const rowspan = parentWidget.rows[rows].cols[cols].options.rowspan;
      const colspan = parentWidget.rows[rows].cols[cols].options.colspan;
      let colSpanNum = 0;
      // 第几列拆分几个
      for (let i = 0; i < parentWidget.rows.length; ) {
        if (i >= rows && i <= rows + rowspan - 1) {
          parentWidget.rows[i].cols[cols].options.rowspan =
            colSpanList[colSpanNum];
          parentWidget.rows[i].cols[cols].merged = false;
          // // 显示拆分行
          for (let m = 0; m < colspan; m++) {
            parentWidget.rows[i].cols[cols].merged = false;
            parentWidget.rows[i].cols[cols].options.colspan = colspan;
          }
          i += colSpanList[colSpanNum];
          colSpanNum++;
        } else {
          i++;
        }
        if (i > rows + rowspan - 1) {
          break;
        }
      }
    },
    insertTableCol(widget, insertPos) {
      let colIdx =
        insertPos === undefined ? widget.rows[0].cols.length : insertPos; //确定插入列位置
      widget.rows.forEach((row) => {
        let newCol = deepClone(this.getContainerByType("table-cell"));
        newCol.id = "table-cell-" + generateId();
        newCol.options.name = newCol.id;
        newCol.merged = false;
        newCol.options.colspan = 1;
        newCol.options.rowspan = 1;
        row.cols.splice(colIdx, 0, newCol);
      });

      let rowNo = 0;
      while (
        colIdx < widget.rows[0].cols.length - 1 &&
        rowNo < widget.rows.length
      ) {
        //越界判断
        let colMerged = widget.rows[rowNo].cols[colIdx + 1].merged; //确定插入位置的单元格是否为合并单元格
        if (!!colMerged) {
          let colArray = widget.rows[rowNo].cols;
          let unMergedCell = {};
          let startColIndex = null;
          for (let i = colIdx; i >= 0; i--) {
            //查找该行已合并的主单元格
            if (!colArray[i].merged && colArray[i].options.colspan > 1) {
              startColIndex = i;
              unMergedCell = colArray[i];
              break;
            }
          }
          let newColspan = unMergedCell.options.colspan + 1;
          this.setPropsOfMergedCols(
            widget.rows,
            rowNo,
            startColIndex,
            newColspan,
            unMergedCell.options.rowspan
          );
          rowNo += unMergedCell.options.rowspan;
        } else {
          rowNo += 1;
        }
      }
      this.emitHistoryChange();
    },

    setPropsOfMergedCols(
      rowArray,
      startRowIndex,
      startColIndex,
      newColspan,
      rowspan
    ) {
      for (let i = startRowIndex; i < startRowIndex + rowspan; i++) {
        for (let j = startColIndex; j < startColIndex + newColspan; j++) {
          if (i === startRowIndex && j === startColIndex) {
            rowArray[i].cols[j].options.colspan = newColspan; //合并后的主单元格
            continue;
          }

          rowArray[i].cols[j].merged = true;
          rowArray[i].cols[j].options.colspan = newColspan;
          rowArray[i].cols[j].widgetList = [];
        }
      }
    },

    setPropsOfMergedRows(
      rowArray,
      startRowIndex,
      startColIndex,
      colspan,
      newRowspan
    ) {
      for (let i = startRowIndex; i < startRowIndex + newRowspan; i++) {
        for (let j = startColIndex; j < startColIndex + colspan; j++) {
          if (i === startRowIndex && j === startColIndex) {
            rowArray[i].cols[j].options.rowspan = newRowspan;
            continue;
          }

          rowArray[i].cols[j].merged = true;
          rowArray[i].cols[j].options.rowspan = newRowspan;
          rowArray[i].cols[j].widgetList = [];
        }
      }
    },

    setPropsOfSplitCol(
      rowArray,
      startRowIndex,
      startColIndex,
      colspan,
      rowspan
    ) {
      for (let i = startRowIndex; i < startRowIndex + rowspan; i++) {
        for (let j = startColIndex; j < startColIndex + colspan; j++) {
          if (i === startRowIndex && j === startColIndex) {
            rowArray[i].cols[j].options.colspan = 1;
            continue;
          }

          rowArray[i].cols[j].merged = false;
          rowArray[i].cols[j].options.colspan = 1;
        }
      }
    },

    setPropsOfSplitRow(
      rowArray,
      startRowIndex,
      startColIndex,
      colspan,
      rowspan
    ) {
      for (let i = startRowIndex; i < startRowIndex + rowspan; i++) {
        for (let j = startColIndex; j < startColIndex + colspan; j++) {
          if (i === startRowIndex && j === startColIndex) {
            rowArray[i].cols[j].options.rowspan = 1; //合并后的主单元格
            continue;
          }

          rowArray[i].cols[j].merged = false;
          rowArray[i].cols[j].options.rowspan = 1;
        }
      }
    },

    mergeTableCol(rowArray, colArray, curRow, curCol, leftFlag, cellWidget) {
      let mergedColIdx = !!leftFlag
        ? curCol
        : curCol + colArray[curCol].options.colspan;
      let remainedColIdx = !!leftFlag
        ? curCol - colArray[curCol - 1].options.colspan
        : curCol;
      if (
        !!colArray[mergedColIdx].widgetList &&
        colArray[mergedColIdx].widgetList.length > 0
      ) {
        //保留widgetList
        if (
          !colArray[remainedColIdx].widgetList ||
          colArray[remainedColIdx].widgetList.length === 0
        ) {
          colArray[remainedColIdx].widgetList = deepClone(
            colArray[mergedColIdx].widgetList
          );
        }
      }

      let newColspan =
        colArray[mergedColIdx].options.colspan * 1 +
        colArray[remainedColIdx].options.colspan * 1;
      this.setPropsOfMergedCols(
        rowArray,
        curRow,
        remainedColIdx,
        newColspan,
        cellWidget.options.rowspan
      );

      this.emitHistoryChange();
    },

    mergeTableWholeRow(rowArray, colArray, rowIndex, colIndex) {
      //需要考虑操作的行存在已合并的单元格！！
      //整行所有单元格行高不一致不可合并！！
      let startRowspan = rowArray[rowIndex].cols[0].options.rowspan;
      let unmatchedFlag = false;
      for (let i = 1; i < rowArray[rowIndex].cols.length; i++) {
        if (rowArray[rowIndex].cols[i].options.rowspan !== startRowspan) {
          unmatchedFlag = true;
          break;
        }
      }
      if (unmatchedFlag) {
        this.vueInstance.$message.info(
          this.vueInstance.i18nt(
            "designer.hint.rowspanNotConsistentForMergeEntireRow"
          )
        );
        return;
      }

      let widgetListCols = colArray.filter((colItem) => {
        return (
          !colItem.merged &&
          !!colItem.widgetList &&
          colItem.widgetList.length > 0
        );
      });
      if (!!widgetListCols && widgetListCols.length > 0) {
        //保留widgetList
        if (
          widgetListCols[0].id !== colArray[0].id &&
          (!colArray[0].widgetList || colArray[0].widgetList.length <= 0)
        ) {
          colArray[0].widgetList = deepClone(widgetListCols[0].widgetList);
        }
      }

      this.setPropsOfMergedCols(
        rowArray,
        rowIndex,
        0,
        colArray.length,
        colArray[colIndex].options.rowspan
      );

      this.emitHistoryChange();
    },

    mergeTableRow(rowArray, curRow, curCol, aboveFlag, cellWidget) {
      let mergedRowIdx = !!aboveFlag
        ? curRow
        : curRow + cellWidget.options.rowspan;
      let remainedRowIdx = !!aboveFlag
        ? curRow - cellWidget.options.rowspan
        : curRow;
      if (
        !!rowArray[mergedRowIdx].cols[curCol].widgetList &&
        rowArray[mergedRowIdx].cols[curCol].widgetList.length > 0
      ) {
        //保留widgetList
        if (
          !rowArray[remainedRowIdx].cols[curCol].widgetList ||
          rowArray[remainedRowIdx].cols[curCol].widgetList.length === 0
        ) {
          rowArray[remainedRowIdx].cols[curCol].widgetList = deepClone(
            rowArray[mergedRowIdx].cols[curCol].widgetList
          );
        }
      }

      let newRowspan =
        rowArray[mergedRowIdx].cols[curCol].options.rowspan * 1 +
        rowArray[remainedRowIdx].cols[curCol].options.rowspan * 1;
      this.setPropsOfMergedRows(
        rowArray,
        remainedRowIdx,
        curCol,
        cellWidget.options.colspan,
        newRowspan
      );

      this.emitHistoryChange();
    },

    mergeTableWholeCol(rowArray, colArray, rowIndex, colIndex) {
      //需要考虑操作的列存在已合并的单元格！！
      //整列所有单元格列宽不一致不可合并！！
      let startColspan = rowArray[0].cols[colIndex].options.colspan;
      let unmatchedFlag = false;
      for (let i = 1; i < rowArray.length; i++) {
        if (rowArray[i].cols[colIndex].options.colspan !== startColspan) {
          unmatchedFlag = true;
          break;
        }
      }
      if (unmatchedFlag) {
        this.vueInstance.$message.info(
          this.vueInstance.i18nt(
            "designer.hint.colspanNotConsistentForMergeEntireColumn"
          )
        );
        return;
      }

      let widgetListCols = [];
      rowArray.forEach((rowItem) => {
        let tempCell = rowItem.cols[colIndex];
        if (
          !tempCell.merged &&
          !!tempCell.widgetList &&
          tempCell.widgetList.length > 0
        ) {
          widgetListCols.push(tempCell);
        }
      });

      let firstCellOfCol = rowArray[0].cols[colIndex];
      if (!!widgetListCols && widgetListCols.length > 0) {
        //保留widgetList
        if (
          widgetListCols[0].id !== firstCellOfCol.id &&
          (!firstCellOfCol.widgetList || firstCellOfCol.widgetList.length <= 0)
        ) {
          firstCellOfCol.widgetList = deepClone(widgetListCols[0].widgetList);
        }
      }

      this.setPropsOfMergedRows(
        rowArray,
        0,
        colIndex,
        firstCellOfCol.options.colspan,
        rowArray.length
      );

      this.emitHistoryChange();
    },

    undoMergeTableCol(rowArray, rowIndex, colIndex, colspan, rowspan) {
      this.setPropsOfSplitCol(rowArray, rowIndex, colIndex, colspan, rowspan);

      this.emitHistoryChange();
    },

    undoMergeTableRow(rowArray, rowIndex, colIndex, colspan, rowspan) {
      this.setPropsOfSplitRow(rowArray, rowIndex, colIndex, colspan, rowspan);

      this.emitHistoryChange();
    },

    deleteTableWholeCol(rowArray, colIndex) {
      //需考虑删除的是合并列！！
      //仅剩一列则不可删除！！
      if (rowArray[0].cols[0].options.colspan === rowArray[0].cols.length) {
        return;
      }

      //整列所有单元格列宽不一致不可删除！！
      let startColspan = rowArray[0].cols[colIndex].options.colspan;
      let unmatchedFlag = false;
      for (let i = 1; i < rowArray.length; i++) {
        if (rowArray[i].cols[colIndex].options.colspan !== startColspan) {
          unmatchedFlag = true;
          break;
        }
      }
      if (unmatchedFlag) {
        this.vueInstance.$message.info(
          this.vueInstance.i18nt(
            "designer.hint.colspanNotConsistentForDeleteEntireColumn"
          )
        );
        return;
      }

      rowArray.forEach((rItem) => {
        rItem.cols.splice(colIndex, startColspan);
      });

      this.emitHistoryChange();
    },

    deleteTableWholeRow(rowArray, rowIndex) {
      //需考虑删除的是合并行！！
      //仅剩一行则不可删除！！
      if (rowArray[0].cols[0].options.rowspan === rowArray.length) {
        return;
      }

      //整行所有单元格行高不一致不可删除！！
      let startRowspan = rowArray[rowIndex].cols[0].options.rowspan;
      let unmatchedFlag = false;
      for (let i = 1; i < rowArray[rowIndex].cols.length; i++) {
        if (rowArray[rowIndex].cols[i].options.rowspan !== startRowspan) {
          unmatchedFlag = true;
          break;
        }
      }
      if (unmatchedFlag) {
        this.vueInstance.$message.info(
          this.vueInstance.i18nt(
            "designer.hint.rowspanNotConsistentForDeleteEntireRow"
          )
        );
        return;
      }

      rowArray.splice(rowIndex, startRowspan);

      this.emitHistoryChange();
    },

    getContainerByType(typeName) {
      let allWidgets = [
        ...containers,
        ...basicFields,
        ...advancedFields,
        ...customFields,
      ];
      let foundCon = null;
      allWidgets.forEach((con) => {
        if (!!con.category && !!con.type && con.type === typeName) {
          foundCon = con;
        }
      });
      return foundCon;
    },

    getFieldWidgetByType(typeName) {
      let allWidgets = [
        ...containers,
        ...basicFields,
        ...advancedFields,
        ...customFields,
      ];
      let foundWidget = null;
      allWidgets.forEach((widget) => {
        if (!!!widget.category && !!widget.type && widget.type === typeName) {
          foundWidget = widget;
        }
      });

      return foundWidget;
    },

    hasConfig(widget, configName) {
      let originalWidget = null;
      if (!!widget.category) {
        originalWidget = this.getContainerByType(widget.type);
      } else {
        originalWidget = this.getFieldWidgetByType(widget.type);
      }

      if (!originalWidget || !originalWidget.options) {
        return false;
      }
      // const aa = Object.keys(originalWidget.options)
      return Object.keys(originalWidget.options).indexOf(configName) > -1;
    },

    cloneGridCol(widget, parentWidget) {
      let newGridCol = deepClone(this.getContainerByType("grid-col"));
      newGridCol.options.span = widget.options.span;
      let tmpId = generateId();
      newGridCol.id = "grid-col-" + tmpId;
      newGridCol.options.name = "gridCol" + tmpId;

      parentWidget.cols.push(newGridCol);
    },

    cloneContainer(containWidget) {
      if (containWidget.type === "grid") {
        let newGrid = deepClone(this.getContainerByType("grid"));
        newGrid.id = newGrid.type + generateId();
        newGrid.options.name = newGrid.id;
        containWidget.cols.forEach((gridCol) => {
          let newGridCol = deepClone(this.getContainerByType("grid-col"));
          let tmpId = generateId();
          newGridCol.id = "grid-col-" + tmpId;
          newGridCol.options.name = "gridCol" + tmpId;
          newGridCol.options.span = gridCol.options.span;
          newGrid.cols.push(newGridCol);
        });

        return newGrid;
      } else if (containWidget.type === "table") {
        let newTable = deepClone(this.getContainerByType("table"));
        newTable.id = newTable.type + generateId();
        newTable.options.name = newTable.id;
        containWidget.rows.forEach((tRow) => {
          let newRow = deepClone(tRow);
          newRow.id = "table-row-" + generateId();
          newRow.cols.forEach((col) => {
            col.id = "table-cell-" + generateId();
            col.options.name = col.id;
            col.widgetList = []; //清空组件列表
          });
          newTable.rows.push(newRow);
        });

        return newTable;
      } else {
        //其他容器组件不支持clone操作
        return null;
      }
    },

    moveUpWidget(parentList, indexOfParentList) {
      if (!!parentList) {
        if (indexOfParentList === 0) {
          this.vueInstance.$message(
            this.vueInstance.i18nt("designer.hint.moveUpFirstChildHint")
          );
          return;
        }

        let tempWidget = parentList[indexOfParentList];
        parentList.splice(indexOfParentList, 1);
        parentList.splice(indexOfParentList - 1, 0, tempWidget);
      }
    },

    moveDownWidget(parentList, indexOfParentList) {
      if (!!parentList) {
        if (indexOfParentList === parentList.length - 1) {
          this.vueInstance.$message(
            this.vueInstance.i18nt("designer.hint.moveDownLastChildHint")
          );
          return;
        }

        let tempWidget = parentList[indexOfParentList];
        parentList.splice(indexOfParentList, 1);
        parentList.splice(indexOfParentList + 1, 0, tempWidget);
      }
    },

    copyNewFieldWidget(origin) {
      let newWidget = deepClone(origin);
      let tempId = generateId();
      newWidget.id = newWidget.type.replace(/-/g, "") + tempId;
      newWidget.options.name = newWidget.id;
      newWidget.options.label = newWidget.type.toLowerCase();

      delete newWidget.displayName;
      return newWidget;
    },

    copyNewContainerWidget(origin, col = 1, row = 1) {
      let newCon = deepClone(origin);
      newCon.id = newCon.type.replace(/-/g, "") + generateId();
      newCon.options.name = newCon.id;
      if (newCon.type === "grid") {
        let newCol = deepClone(this.getContainerByType("grid-col"));
        let tmpId = generateId();
        newCol.id = "grid-col-" + tmpId;
        newCol.options.name = "gridCol" + tmpId;
        newCon.cols.push(newCol);
        //
        // newCol = deepClone(newCol)
        // tmpId = generateId()
        // newCol.id = 'grid-col-' + tmpId
        // newCol.options.name = 'gridCol' + tmpId
        // newCon.cols.push(newCol)
      } else if (newCon.type === "table") {
        // let newRow = { cols: [] }
        // newRow.id = 'table-row-' + generateId()
        // newRow.merged = false
        // let newCell = deepClone(this.getContainerByType('table-cell'))
        // newCell.id = 'table-cell-' + generateId()
        // newCell.options.name = newCell.id
        // newCell.merged = false
        // newCell.options.colspan = col
        // newCell.options.rowspan = row
        // newRow.cols.push(newCell)
        // newCon.rows.push(newRow)
        for (let i = 0; i < row; i++) {
          let newRow = { cols: [] };
          newRow.id = "table-row-" + generateId();
          newRow.merged = false;
          newCon.rows.push(newRow);
          for (let j = 0; j < col; j++) {
            let newCell = deepClone(this.getContainerByType("table-cell"));
            newCell.id = "table-cell-" + generateId();
            newCell.options.name = newCell.id;
            newCell.merged = false;
            newCell.options.colspan = 1;
            newCell.options.rowspan = 1;
            newRow.cols.push(newCell);
          }
        }
      } else if (newCon.type === "tab") {
        let newTabPane = deepClone(this.getContainerByType("tab-pane"));
        newTabPane.id = "tab-pane-" + generateId();
        newTabPane.options.name = "tab1";
        newTabPane.options.label = "tab 1";
        newCon.tabs.push(newTabPane);
      }
      //newCon.options.customClass = []

      delete newCon.displayName;
      return newCon;
    },

    addContainerByDbClick(container, col = 1, row = 1) {
      let newCon = this.copyNewContainerWidget(container, col, row);
      this.widgetList.push(newCon);
      this.setSelected(newCon);
    },

    addFieldByDbClick(widget) {
      let newWidget = this.copyNewFieldWidget(widget);
      if (!!this.selectedWidget && this.selectedWidget.type === "tab") {
        //获取当前激活的tabPane
        let activeTab = this.selectedWidget.tabs[0];
        this.selectedWidget.tabs.forEach((tabPane) => {
          if (!!tabPane.options.active) {
            activeTab = tabPane;
          }
        });

        !!activeTab && activeTab.widgetList.push(newWidget);
      } else if (!!this.selectedWidget && !!this.selectedWidget.widgetList) {
        this.selectedWidget.widgetList.push(newWidget);
      } else {
        this.widgetList.push(newWidget);
      }

      this.setSelected(newWidget);
      this.designer.emitHistoryChange();
    },

    deleteColOfGrid(gridWidget, colIdx) {
      if (!!gridWidget && !!gridWidget.cols) {
        gridWidget.cols.splice(colIdx, 1);
      }
    },

    addNewColOfGrid(gridWidget) {
      const cols = gridWidget.cols;
      let newGridCol = deepClone(this.getContainerByType("grid-col"));
      let tmpId = generateId();
      newGridCol.id = "grid-col-" + tmpId;
      newGridCol.options.name = "gridCol" + tmpId;
      if (!!cols && cols.length > 0) {
        let spanSum = 0;
        cols.forEach((col) => {
          spanSum += col.options.span;
        });

        if (spanSum >= 24) {
          //this.$message.info('列栅格之和超出24')
          console.log("列栅格之和超出24");
          gridWidget.cols.push(newGridCol);
        } else {
          newGridCol.options.span = 24 - spanSum > 12 ? 12 : 24 - spanSum;
          gridWidget.cols.push(newGridCol);
        }
      } else {
        gridWidget.cols = [newGridCol];
      }
    },

    addTabPaneOfTabs(tabsWidget) {
      const tabPanes = tabsWidget.tabs;
      let newTabPane = deepClone(this.getContainerByType("tab-pane"));
      newTabPane.id = "tab-pane-" + generateId();
      newTabPane.options.name = newTabPane.id;
      newTabPane.options.label = "tab " + (tabPanes.length + 1);
      tabPanes.push(newTabPane);
    },

    deleteTabPaneOfTabs(tabsWidget, tpIdx) {
      tabsWidget.tabs.splice(tpIdx, 1);
    },

    emitEvent(evtName, evtData) {
      //用于兄弟组件发射事件
      this.vueInstance.$emit(evtName, evtData);
    },

    handleEvent(evtName, callback) {
      //用于兄弟组件接收事件
      this.vueInstance.$on(evtName, (data) => callback(data));
    },

    setCssClassList(cssClassList) {
      this.cssClassList = cssClassList;
    },

    getCssClassList() {
      return this.cssClassList;
    },

    registerFormWidget(formWidget) {
      this.formWidget = formWidget;
    },

    initHistoryData() {
      this.loadFormContentFromStorage();
      this.historyData.index++;
      this.historyData.steps[this.historyData.index] = {
        widgetList: deepClone(this.widgetList),
        formConfig: deepClone(this.formConfig),
      };
    },

    emitHistoryChange() {
      //console.log('------------', 'Form history changed!')

      if (this.historyData.index === this.historyData.maxStep - 1) {
        this.historyData.steps.shift();
      } else {
        this.historyData.index++;
      }

      this.historyData.steps[this.historyData.index] = {
        widgetList: deepClone(this.widgetList),
        formConfig: deepClone(this.formConfig),
      };

      this.saveFormContentToStorage();

      if (this.historyData.index < this.historyData.steps.length - 1) {
        this.historyData.steps = this.historyData.steps.slice(
          0,
          this.historyData.index + 1
        );
      }

      console.log("history", this.historyData.index);
    },

    saveCurrentHistoryStep() {
      this.historyData.steps[this.historyData.index] = deepClone({
        widgetList: this.widgetList,
        formConfig: this.formConfig,
      });

      this.saveFormContentToStorage();
    },

    undoHistoryStep() {
      if (this.historyData.index !== 0) {
        this.historyData.index--;
      }
      console.log("undo", this.historyData.index);

      this.widgetList = deepClone(
        this.historyData.steps[this.historyData.index].widgetList
      );
      this.formConfig = deepClone(
        this.historyData.steps[this.historyData.index].formConfig
      );
    },

    redoHistoryStep() {
      if (this.historyData.index !== this.historyData.steps.length - 1) {
        this.historyData.index++;
      }
      console.log("redo", this.historyData.index);

      this.widgetList = deepClone(
        this.historyData.steps[this.historyData.index].widgetList
      );
      this.formConfig = deepClone(
        this.historyData.steps[this.historyData.index].formConfig
      );
    },

    undoEnabled() {
      return this.historyData.index > 0 && this.historyData.steps.length > 0;
    },

    redoEnabled() {
      return this.historyData.index < this.historyData.steps.length - 1;
    },

    saveFormContentToStorage() {
      localStorage.setItem(
        "widget__list__backup",
        JSON.stringify(this.widgetList)
      );
      localStorage.setItem(
        "form__config__backup",
        JSON.stringify(this.formConfig)
      );
    },

    loadFormContentFromStorage() {
      let widgetListBackup = localStorage.getItem("widget__list__backup");
      if (!!widgetListBackup) {
        this.widgetList = JSON.parse(widgetListBackup);
      }

      let formConfigBackup = localStorage.getItem("form__config__backup");
      if (!!formConfigBackup) {
        //this.formConfig = JSON.parse(formConfigBackup)
        overwriteObj(
          this.formConfig,
          JSON.parse(formConfigBackup)
        ); /* 用=赋值，会导致inject依赖注入的formConfig属性变成非响应式 */
      }
    },
  };
}
