/**
 * 匹配树结构对象
 * @param {Array} data 树级列表
 * @param {String} val 匹配值
 * @param {Object} options 选项，格式为: { children: ['children'], key: 'id' }
 */

export function getTreeChildren(data, val, options) {
  const statics = {
    children: ["children"],
    key: "id",
  };
  if (options) {
    for (const i in statics) {
      statics[i] = options[i];
    }
  }
  // let hasFound = false
  const result = [];
  const checkHasChildren = (data) => {
    let childArr = null;
    for (const i in statics.children) {
      if (data[statics.children[i]] && data[statics.children[i]].length > 0) {
        childArr = data[statics.children[i]];
        break;
      }
    }
    return childArr;
  };
  const fn = (data) => {
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item[statics.key] === val) {
          result.push(item);
        }
        if (checkHasChildren(item)) {
          fn(checkHasChildren(item));
        }
      });
    }
  };
  fn(data);
  return result;
}
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return "";
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
  ).join("&");
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, " ") +
      '"}'
  );
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== "object") {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === "object") {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === "start") {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + "";
  const randomNum = parseInt((1 + Math.random()) * 65536) + "";
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

/**
 * pid-id tree convert to array 深度优先遍历  堆栈  后进先出
 * @param {Array} treeNodes 数据
 */
export function deepTree(node, child = "children") {
  const stack = node;
  const data = [];
  while (stack.length !== 0) {
    const pop = stack.pop();
    data.push({
      id: pop.id,
      name: pop.name,
      parentId: pop.parentId,
    });
    const children = pop[child];
    if (children) {
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i]);
      }
    }
  }
  return data;
}

/**
 * pid-id array convert to tree
 * @param {Array} treeNodes 数据
 */
export function iteratorTree(data, pid = "pId") {
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item) {
    delete item.children;
  });

  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  var map = {};
  data.forEach(function (item) {
    map[item.id] = item;
  });
  //        console.log(map);
  var val = [];
  data.forEach(function (item) {
    // 以当前遍历项，的parentId,去map对象中找到索引的id
    var parent = map[item[pid]];
    // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      // eslint-disable-next-line
      (parent.children || (parent.children = [])).push(item);
    } else {
      // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item);
    }
  });
  return val;
}

/**
 * 树形结构广度遍历查唯一值
 * @param {Array} tree 树形结构
 * @param {String} id 唯一值
 */
export function breadthQuery(tree, id) {
  var stark = [];

  stark = stark.concat(tree);

  while (stark.length) {
    var temp = stark.shift();
    if (temp.children) {
      stark = stark.concat(temp.children);
    }
    if (temp.id === id) {
      return temp;
    }
  }
}

/**
 * Cascader 默认值
 * element UI的Cascader级联选择器组件在编辑时需要一个级联数组值
 * ===>根据最底部的ID找出他的所有父级id
 * 3 ==> [1,3]
 * @param {String} key 查询的唯一值
 * @param {Array} treeData 树形结构
 */
export function getTreeDeepArr(key, treeData) {
  const arr = []; // 在递归时操作的数组
  let returnArr = []; // 存放结果的数组
  let depth = 0; // 定义全局层级
  // 定义递归函数
  function childrenEach(childrenData, depthN) {
    for (var j = 0; j < childrenData.length; j++) {
      depth = depthN; // 将执行的层级赋值 到 全局层级

      arr[depthN] = childrenData[j].id;

      if (childrenData[j].id === key) {
        // returnArr = arr; // 原写法不行, 因 此赋值存在指针关系
        returnArr = arr.slice(0, depthN + 1); // 将目前匹配的数组，截断并保存到结果数组，
        break;
      } else {
        if (childrenData[j].children) {
          depth++;
          childrenEach(childrenData[j].children, depth);
        }
      }
    }
    return returnArr;
  }
  return childrenEach(treeData, depth);
}

/**
 * 这边有一个坑啊，el-cascader不允许children未空的不规范数据格式,多层级的value也不允许一致
 * 递归将选项中的 value 值及其 children 删掉
 *
 * @param {Array} options 选项，格式为: [{ value: 0, label: "", children: [{ value: 2, label: "" }] }]
 */
export function parseValueToCascader(options) {
  options.forEach((opt) => {
    if (opt.children && opt.children.length > 0) {
      this.parseValueToCascader(opt.children);
    } else if (opt.children && opt.children.length === 0) {
      delete opt.children;
    }
  });
  return options;
}

// 获取图片路径
export function getImgList(name, type = "png") {
  return [
    // eslint-disable-next-line
    // require(`@wfmng/assets/images/${name}.${type}`),
    // require(`../../..//${name}.${type}`),
    // // eslint-disable-next-line
    // require(`@wfmng/assets/images/${name}@2x.${type}`)
  ];
}

// 获取UUID
export function generateUUID() {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); // use high-precision timer if available
  }
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid.replace(/\-/g, "");
}
// 节流
// fn为函数名,delay为节流时间
export function throttle(fn, delay) {
  // 4、通过闭包保存一个标记
  let canRun = true;
  return function () {
    // 5、在函数开头判断标志是否为 true，不为 true 则中断函数
    if (!canRun) {
      return;
    }
    // 6、将 canRun 设置为 false，防止执行之前再被执行
    canRun = false;
    // 7、定时器
    setTimeout(() => {
      fn.call(this, arguments);
      // 8、执行完事件（比如调用完接口）之后，重新将这个标志设置为 true
      canRun = true;
    }, delay);
  };
}
