## 1. debounce

## 2. throttle

## 3. new 

## 4. call

## 5. apply

## 6. bind
```js
// bind 函数实现
Function.prototype.myBind = function(context) {
  // 判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  // 获取参数
  var args = [...arguments].slice(1),
      fn = this;
  return function Fn() {
    // 根据调用方式，传入不同绑定值
    return fn.apply(
      this instanceof Fn ? this : context,
      args.concat(...arguments)
    );
  };
};
```
## 7. instanceof

## 8. Promise
详见另一篇文章
## 9. Promise.then

## 10. Promise.race

## 11. Promise.all

## 12. 类型判断

## 13. curry

## 14. 浅拷贝

## 15. 深拷贝

## 16. sleep
```js
function timeout(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
};
```
## 17. AJAX
```js
const SERVER_URL = "/server";
let xhr = new XMLHttpRequest();
// 创建 Http 请求
xhr.open("GET", SERVER_URL, true);
// 设置状态监听函数
xhr.onreadystatechange = function() {
  if (this.readyState !== 4) return;
  // 当请求成功时
  if (this.status === 200) {
    handle(this.response);
  } else {
    console.error(this.statusText);
  }
};
// 设置请求失败时的监听函数
xhr.onerror = function() {
  console.error(this.statusText);
};
// 设置请求头信息
xhr.responseType = "json";
xhr.setRequestHeader("Accept", "application/json");
// 发送 Http 请求
xhr.send(null);
```