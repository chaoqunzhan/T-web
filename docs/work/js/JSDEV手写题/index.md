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
