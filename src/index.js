const rootNodeName = 'BODY';

/**
 * 判断选中的sel元素里是否含有指定的classNames元素
 * @param {Selection} sel
 * @param {array} classNames
 */
function hasTargetNode(sel, classNames) {
  if (!classNames.length) return false;
  function containsTarget(node, list) {
    let result = false;
    for (let i = 0; i < list.length; i++) {
      if (node.containsNode(list[i])) {
        result = true;
        break;
      }
    }
    return result;
  }
  function reverseTraverseNode(node) {
    if (node.tagName === rootNodeName) { // 全选
      return false;
    }
    if (Array.prototype.some.call(node.classList, (v) => classNames.indexOf(v) !== -1)) return true;
    if (!node.parentNode) return false;
    return reverseTraverseNode(node.parentNode)
  }
  const targets = classNames.reduce((acc, current) => {
    acc.push(...document.getElementsByClassName(current))
    return acc;
  }, [])
  if (containsTarget(sel, targets)) return true;
  const range = sel.getRangeAt(0);
  const firstRangeNode = range.startContainer.parentNode;
  if (reverseTraverseNode(firstRangeNode)) return true;
  const lastRangeNode = range.endContainer.parentNode;
  if (reverseTraverseNode(lastRangeNode)) return true;
  return false;
}
/**
 * 对选区数据做自定义处理
 * @param {Selection} sel
 */
function customGetSelection(sel, encryption) {
  const range = sel.getRangeAt(0);
  const result = {
    type: '',
    html: '',
    text: '',
  }
  if (range.collapsed) {
    // 如果是只选中了表单元素的情况下
    result.html = encryption(sel);
    result.text = encryption(sel);
    result.type = 'input'
    return result;
  }
  const fragment = range.cloneContents();
  const container = document.createElement('div');
  container.appendChild(fragment);
  const scripts = Array.from(container.querySelectorAll('script'));
  const styles = Array.from(container.querySelectorAll('style'));
  scripts.concat(styles).forEach((node) => {
    node.remove();
  });
  result.type = 'div';
  result.html = encryption(container.innerHTML);
  result.text = encryption(sel);
  return result;
}
class ClipboardEncryption {
  constructor({ classNames, encryption }) {
    this.classNames = classNames;
    this.encryption = encryption;
  }
  start() {
    document.addEventListener('copy', this.copyListener, true);
    document.addEventListener('cut', this.copyListener, true);
  }
  remove() {
    document.removeEventListener('copy', this.copyListener, true);
    document.removeEventListener('copy', this.copyListener, true);
  }
  copyListener = (evt) => {
    const sel = document.getSelection();
    if (!hasTargetNode(sel, this.classNames)) return
    const data = customGetSelection(sel, this.encryption);
    evt.clipboardData.setData('text/plain', data.text);
    evt.clipboardData.setData('text/html', data.html);
    evt.preventDefault();
  }
}

export default ClipboardEncryption;