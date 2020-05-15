# clipboard-encryption
粘贴复制内容可实现局部和全部的数据加密
# Usage
install package
```
npm i -D clipboard-encryption
```
or with yarn
```
yarn add  clipboard-encryption
```
# API
```javascript
import ClipboardEncryption from 'clipboard-encryption'
new ClipboardEncryption({classNames: ["question-detail"], encryption})
```
# Parameters
* classNames: 需要加密元素的class, 支持多个元素
* encryption: 需要加密的function,参数是Dom 选中的内容

# Methods
* start: 开始启动加密
* remove: 取消加密处理
# Usage

```javascript
import ClipboardEncryption from 'clipboard-encryption'
function encryption (data) {
  return escape(data)
}
const demo = new ClipboardEncryption({classNames: ["question-detail"], encryption})
demo.start()
```

