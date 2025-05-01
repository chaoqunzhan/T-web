## 1. Implement a Queue by using Stack
- 使用双栈

## 2. merge sorted arrays
- 两两合并方法
- 两两合并，遇到落单的记得处理
- 两两合并完，返回原数组
- 当原数组长度为1时，返回结果

## 3. 字符串解码
> uncompress('3(ab)') // 'ababab'  
> uncompress('3(ab2(c))') // 'abccabccabcc'
- 使用辅助栈
- 把遇到`(`前的倍数和字符存下来
- 遇到`)`后把解码

## 4. create an interval
- 清除定时器注意使用函数方法

```js
/**
 * @param {Function} func
 * @param {number} delay
 * @param {number} period
 * @return {number}
 */
function mySetInterval(func, delay, period) {
  // your code here
  let timer = null
  const repeat = function(n){
    timer = setTimeout(()=>{
      func()
      repeat(n+1)
    }, delay + period * n)
  }
  repeat(0)
  return {
    timer,
    clear: () => clearTimeout(timer)  //关键点
  }
}

/**
 * @param { number } id
 */
function myClearInterval(id) {
  if(id) id.clear()     //关键点
}
```

## 5. throttle Promises
```js
function throttlePromises(funcs, max) {
  if (funcs.length === 0) return Promise.resolve([]);
  return new Promise((resolve, reject) => {
    let completed = 0
    let index = 0
    const result = []
    async function work(){
      try{
        while(index < funcs.length){
          const fn = funcs[index]
          const i = index
          index++
          const res = await fn()
          result[i] = res
          completed++
          if(completed === funcs.length){
            resolve(result)
          }
        }
      }catch(err){
        reject(err)
      }
    }
    for(let i=0; i<Math.min(max, funcs.length); i++){
      work()
    }
  })
}
```

## 6. lodash.get
```js
function get(source, path, defaultValue = undefined) {
  // your code here
  const parts = Array.isArray(path) ? path : path
    .replaceAll("[", ".")
    .replaceAll("]", "")
    .split(".")
  if (parts.length === 0) {
    return defaultValue
  }
  for (const part of parts) {
    if (source[part] === undefined) {
      return defaultValue
    }
    source = source[part]
  }
  return source
}
```

## 7. lodash.once()
```js
/**
 * @param {Function} func
 * @return {Function}
 */
function once(func) {
  // your code here
  let passed = false
  let result
  return function(){
    if(!passed){
      result = func.apply(this, arguments)
      passed = true
    }
    return result
  }
}
```
 
## 8、lodash.cloneDeep()
```js
function cloneDeep(obj, map = new Map()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (map.has(obj)) {
    return map.get(obj);
  }
  const output = Array.isArray(obj) ? [] : {};
  map.set(obj, output);
  const keys = [...Object.getOwnPropertySymbols(obj), ...Object.keys(obj)]; //注意
  for (const key of keys) {
    const val = obj[key];
    output[key] = cloneDeep(val, map);
  }
  return output;
}
```

## 9. lodash.equal()
```js
function isEqual(a, b, map = new Map()) {
  if(typeof a !== 'object' || a === null){
    return a === b
  }
  if (map.has(a) || map.has(b)) return true;
  map.set(a, b);  //注意这里
  const keys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]))
  for(let key of keys){
    if(!isEqual(a[key], b[key], map)){
      return false
    }
  }
  return true
}
```

## 10. lodash.partial()
```js
function partial(func, ...args) {
  return function(...myArgs){
    const argList = args.map(item=>{
      if(item===partial.placeholder){
        return myArgs.shift()
      }else{
        return item
      }
    })
    return func.apply(this, [...argList, ...myArgs])
  }
}
partial.placeholder = Symbol()  //注意这里
```

## 11. lodash.set()
```ts
function set<T extends object>(
  obj: T,
  path: string | string[],
  value: any
): T {
  const result = { ...obj }; // 创建副本避免污染原对象（可选）
  let current: any = result;

  // 处理路径解析
  let pList: string[];
  if (typeof path === 'string') {
    pList = path
      .replaceAll(/$/g, '.')
      .replaceAll(/$/g, '')
      .split('.')
  } else {
    pList = path;
  }

  for (let i = 0; i < pList.length - 1; i++) {
    const key = pList[i];
    // 判断下一个是数字 -> 使用数组，否则使用对象
    const nextKey = pList[i + 1];
    const isNextKeyNumeric = !isNaN(parseInt(nextKey, 10));
    if (!current.hasOwnProperty(key)) {
      current[key] = isNextKeyNumeric ? [] : {};
    }
    current = current[key];
  }
  const lastKey = pList[pList.length - 1];
  current[lastKey] = value;
  return result;
}
```