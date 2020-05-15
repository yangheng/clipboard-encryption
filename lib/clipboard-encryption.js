'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var rootNodeName = 'BODY';
/**
 * 判断选中的sel元素里是否含有指定的classNames元素
 * @param {Selection} sel
 * @param {array} classNames
 */

function hasTargetNode(sel, classNames) {
  if (!classNames.length) return false;

  function containsTarget(node, list) {
    var result = false;

    for (var i = 0; i < list.length; i++) {
      if (node.containsNode(list[i])) {
        result = true;
        break;
      }
    }

    return result;
  }

  function reverseTraverseNode(node) {
    if (node.tagName === rootNodeName) {
      // 全选
      return false;
    }

    if (Array.prototype.some.call(node.classList, function (v) {
      return classNames.indexOf(v) !== -1;
    })) return true;
    if (!node.parentNode) return false;
    return reverseTraverseNode(node.parentNode);
  }

  var targets = classNames.reduce(function (acc, current) {
    acc.push.apply(acc, _toConsumableArray(document.getElementsByClassName(current)));
    return acc;
  }, []);
  if (containsTarget(sel, targets)) return true;
  var range = sel.getRangeAt(0);
  var firstRangeNode = range.startContainer.parentNode;
  if (reverseTraverseNode(firstRangeNode)) return true;
  var lastRangeNode = range.endContainer.parentNode;
  if (reverseTraverseNode(lastRangeNode)) return true;
  return false;
}
/**
 * 对选区数据做自定义处理
 * @param {Selection} sel
 */


function customGetSelection(sel, encryption) {
  var range = sel.getRangeAt(0);
  var result = {
    type: '',
    html: '',
    text: ''
  };

  if (range.collapsed) {
    // 如果是只选中了表单元素的情况下
    result.html = encryption(sel);
    result.text = encryption(sel);
    result.type = 'input';
    return result;
  }

  var fragment = range.cloneContents();
  var container = document.createElement('div');
  container.appendChild(fragment);
  var scripts = Array.from(container.querySelectorAll('script'));
  var styles = Array.from(container.querySelectorAll('style'));
  scripts.concat(styles).forEach(function (node) {
    node.remove();
  });
  result.type = 'div';
  result.html = encryption(container.innerHTML);
  result.text = encryption(sel);
  return result;
}

var ClipboardEncryption = /*#__PURE__*/function () {
  function ClipboardEncryption(_ref) {
    var _this = this;

    var classNames = _ref.classNames,
        encryption = _ref.encryption;

    _classCallCheck(this, ClipboardEncryption);

    _defineProperty(this, "copyListener", function (evt) {
      var sel = document.getSelection();
      if (!hasTargetNode(sel, _this.classNames)) return;
      var data = customGetSelection(sel, _this.encryption);
      evt.clipboardData.setData('text/plain', data.text);
      evt.clipboardData.setData('text/html', data.html);
      evt.preventDefault();
    });

    this.classNames = classNames;
    this.encryption = encryption;
  }

  _createClass(ClipboardEncryption, [{
    key: "start",
    value: function start() {
      document.addEventListener('copy', this.copyListener, true);
      document.addEventListener('cut', this.copyListener, true);
    }
  }, {
    key: "remove",
    value: function remove() {
      document.removeEventListener('copy', this.copyListener, true);
      document.removeEventListener('copy', this.copyListener, true);
    }
  }]);

  return ClipboardEncryption;
}();

module.exports = ClipboardEncryption;
