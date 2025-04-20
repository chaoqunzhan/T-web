## 1. 交换a,b的值，不能用临时变量

## 2. 实现数组的乱序输出

## 3. 数字千分位

## 4. 非负大数相加/相乘

## 5. 循环打印红绿灯

## 6. 实现双向绑定
```js
let obj = {}
let input = document.getElementById('input')
let span = document.getElementById('span')
// 数据劫持
Object.defineProperty(obj, 'text', {
  configurable: true,
  enumerable: true,
  get() {
    console.log('获取数据了')
  },
  set(newVal) {
    console.log('数据更新了')
    input.value = newVal
    span.innerHTML = newVal
  }
})
// 输入监听
input.addEventListener('keyup', function(e) {
  obj.text = e.target.value
})
```

## 7. 判断对象是否存在循环引用
