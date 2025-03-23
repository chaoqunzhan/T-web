

`Promise`最早是社区提出并实现的JS异步编程解救方案之一，避免所谓“回调地狱”，在ES6中已经进行了语言标准和用法的统一。从语法上说，`Promise` 是一个对象，从它可以获取异步操作的消息。`Promise` 提供统一的 API，各种异步操作都可以用同样的方法进行处理。具体的使用可以参考阮一峰的ES6入门教程https://es6.ruanyifeng.com/#docs/promise

本文主要来看看怎么一步一步的实现`Promise`，从原理上搞懂“承诺”是啥玩意儿？



## 一、Promise是个啥？

首先，我们借用chrome浏览器运行一段`Promise`代码并打印出这个`Promise`实例：

```js
let testPromise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('fulfilled result');
    },1000)
});
console.log(testPromise)
```

<!-- <img src="/Users/zhanchaoqun/Library/Application Support/typora-user-images/image-20220109133457866.png" alt="image-20220109133457866" style="zoom:50%;" /> -->

由打印的结果可以看出，`Promise`的原型中包含：`catch`, `constructor`,`finally`和`then`方法；实例中有`PromiseState`和`PromiseResult`分别代表`Promise`的状态和结果。当然，从打印的结果并不能看到`Promise`如何实现的，我也只是出于好奇才打印出来看看的。结果是对我们的学习好像并没有太多作用。



## 二、构造`Promise`骨架

接着，我们来罗列一下`Promise`的几个关键要素：

- 状态：`pending`(执行中)、`fulfilled`(已完成)、`rejected`(已失败)；
- `Promise`对象中传入的函数`handle`,它包含`resolve`和`reject`两个参数，它们是用来改变`Promise`状态和值的函数，而且`handle`是立执行的函数；
- `.then`等其他`Promise`方法；

根据上面的几个要素我们大致构造出`Promise`对象：

```js
//version 1
function _Promise(handle){
  	const PENDING = 'pending';
    const FULFILLED = 'fulfilled';
    const REJECTED = 'rejected';
    this._status = PENDING;   //设置初始状态
    this._value = null;		//设置初始值
  
  	function _resolve(val){
        if(this._status !== PENDING) return 
        this._status = FULFILLED;
        this._value = val;
    }
    function _reject(reason){
        if(this._status !== 'PENDING') return 
        this._status = 'REJECTED';
        this._value = reason;
    }
    handle(_resolve.bind(this),_reject.bind(this))
}
//结合上面的例子，handle = (resolve,reject)=>{...}

```

当`handle`中执行`resolve`时，其实就是执行`_resolve`，当`handle`中执行`reject`时，其实就是执行`_reject`。

- `resolve`：状态由`pending`转为`fulfilled`，而且传入的实参将被作为`Promise`的值，也就是`this._value`;
- `reject`：状态由`pending`转为`rejected`，而且传入的实参将被作为`Promise`的值，也就是`this._value`;

因为`handle`是立执行的，所以代码中直接运行了`handle(_resolve.bind(this),_reject.bind(this))`,但由于handle在执行中可能出现错误，且`Promise`规定了`handle`必须是函数类型，所以我们对上面的代码进行优化如下：

```js
//version 2
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function _Promise(handle){
    if (typeof handle !=='function') {
        throw new Error(`${handle} must be a function!`)
    }
    this._status = PENDING;   //设置初始状态
    this._value = null;		//设置初始值
  
  	function _resolve(val){
        if(this._status !== PENDING) return 
        this._status = FULFILLED;
        this._value = val;
    }
    function _reject(reason){
        if(this._status !== 'PENDING') return 
        this._status = 'REJECTED';
        this._value = reason;
    }
    try {
        handle(_resolve.bind(this),_reject.bind(this))
    } catch(err) {   //捕获handle执行的错误
        _reject(err)
    }
}
```

补充：状态的改变必须是从`pending`开始，也就是说如果当前的状态不是`pending`将不会进行状态和值的修改。



## 三、.`then`方法和`.then`的链式调用

### 3.1简单的`.then`

所有由`_Promise`类创造出来的实例都可以使用`then`方法，所以我们要把`then`定义在`_Promise`的原型上:

```javascript
_Promise.prototype.then = function(onFulfilled,onRejected){
    if(this._status === PENDING){
        this.onFulfilled = onFulfilled;
        this.onRejected = onRejected;
    }
}
```

在`.then`方法中接受两个参数`onFulfilled`和`onRejected`,这俩参数都是可选的，分别是`resolve`和`reject`的回调函数。上面代码在初始化的时候，先把回调函数分别储存起来。而在状态变化的`_resolve`和`_reject`才去执行对应的回调函数，所以代码改为：

```js
//version 3
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function _Promise(handle){
    if (typeof handle !=='function') {
        throw new Error(`${handle} must be a function!`)
    }
    this._status = PENDING;   //设置初始状态
    this._value = null;		//设置初始值
  	this.onFulfilled = null;  //用来储存resolve的回调
    this.onRejected = null;  //用来储存reject的回调

  	this._resolve = (val)=>{
        if(this._status !== PENDING) return 
        this._status = FULFILLED;
        this._value = val;
        this.onFulfilled(this._value);   //执行回调
    }
    this._reject = (reason)=>{
        if(this._status !== PENDING) return 
        this._status = REJECTED;
        this._reason = reason;
        this.onRejected(this._reason);  //执行回调
    }
    try {
        handle(this._resolve.bind(this),this._reject.bind(this))
    } catch(err) {   
        this._reject(err)
    }
}

_Promise.prototype.then = function(onFulfilled,onRejected){
    if(this._status === PENDING){    //当状态是PENDING，暂存onFulfilled和onRejected方法
        this.onFulfilledQueues.push(()=>{
            onFulfilled(this._value);
        });
        this.onRejectedQueues.push(()=>{
            x=onRejected(this._reason);
        });
    }

    if(this._status === FULFILLED){  //当状态是FULFILLED立即执行onFulfilled
        onFulfilled(this._value);
    }
    if(this._status === REJECTED){   //当状态是REJECTED立即执行onFulfilled
        x=onRejected(this._reason);
    }
}
```

到这里我们已经完成了`.then`方法的基本实现，但是还不能支持链式调用。

### 3.2 `.then`链式调用

链式调用中，如果前一个`.then`返回的值不是`Promise`，就将该值作为下一个`Promise`的成功结果；如果前一个`.then`返回的值是`Promise`，则取它的结果作为下一个`Promise`的成功结果。

#### 3.2.1 前一个`.then`返回的值不是`Promise`

先来看看原生`Promise`的`.then`链式调用，其中所有的return都是普通值。

```js
let testPromise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(10);
    },1000)
});
testPromise.then(
    value=>{
        console.log('fulfilled1:',value)
        return value
    },
    reason=>{
        console.log('rejected1:',reason)
        return reason
    }
)
.then(
    value=>{
        console.log('fulfilled2:',value)
    },
    reason=>{
        console.log('rejected2:',reason)
    }
)
//结果输出为：
//fulfilled1: 10
//fulfilled2: 10
```

上面的原生代码中，第一个`.then`返回的是`testPromise`的执行结果，第二个`.then`返回的是第一个`.then`的执行结果。下面我们就修改`_Promise`来满足普通值的链式调用:

```js
//version 4
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function _Promise(handle){
    if (typeof handle !=='function') {
        throw new Error(`${handle} must be a function!`)
    }
    this._status = PENDING;   //设置初始状态
    this._value = null;		//设置初始值
    this.onFulfilledQueues = [];   //成功暂存队列，链式调用需要暂存多个方法
    this.onRejectedQueues = [];    //失败暂存队列，链式调用需要暂存多个方法

  	this._resolve = (val)=>{
        if(this._status !== PENDING) return 
        this._status = FULFILLED;
        this._value = val;
        this.onFulfilledQueues.forEach(fun=>fun());   //成功时一次调用
    }
    this._reject = (reason)=>{
        if(this._status !== PENDING) return 
        this._status = REJECTED;
        this._reason = reason;
        this.onRejectedQueues.forEach(fun=>fun());   //失败时一次调用
    }
    try {
        handle(this._resolve.bind(this),this._reject.bind(this))
    } catch(err) {   
        this._reject(err)
    }
}

_Promise.prototype.then = function(onFulfilled,onRejected){
    let x;  //用来储存第一个.then回调的结果，将作为第二个.then的值
    return new _Promise((resolve,reject)=>{
        if(this._status === PENDING){
            this.onFulfilledQueues.push(()=>{
                try {
                    x=onFulfilled(this._value);
                    resolve(x)
                }catch (e){
                    reject(e)
                }
            });
            this.onRejectedQueues.push(()=>{
                try {
                    x=onRejected(this._reason);
                    resolve(x)
                }catch (e){
                    reject(e)
                }
            });
        }

        if(this._status === FULFILLED){
            x=onFulfilled(this._value);
            resolve(x)
        }
        if(this._status === REJECTED){
            x=onRejected(this._reason);
            resolve(x)
        }
    })
}
```

在version 4中，我们修改了两个暂存成功和失败的回调函数的队列，分别为`this.onFulfilledQueues`和`this.onRejectedQueues`，这是因为在链式调用中，异步情况将会有多个`.then`的回调函数，需要保存在队列中。在定义的`_Promise.prototype.then`中返回一个新的`_Promise`将第一个`.then`返回的结果`x=onFulfilled(this._value);作为第二个`.then`的值，这里采用了递归。

#### 3.2.2 前一个`.then`返回的值是`Promise`

上面我们已经实现了普通值的链式调用，接下来要考虑`.then`返回的值是`Promise`的情况。还是一样的先用原生的`Promise`来试试：

```js
let testPromise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(10);
    },1000)
});
testPromise.then(
    value=>{
        console.log('fulfilled1:',value)
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve(20);
            },1000)
        })
    },
    reason=>{
        console.log('rejected1:',reason)
        return reason
    }
)
.then(
    value=>{
        console.log('fulfilled2:',value)
    },
    reason=>{
        console.log('rejected2:',reason)
    }
)
//结果输出为：
//fulfilled1: 10
//fulfilled2: 20
```

在这种情况下，第一个`.then`中的`resolve(20);`将被作为第二个`.then`中的成功值。接下来我们改装一下version 4以适配返回值是`Promise`的情况：

```js
//version 5
//链式调用，没有返回Promise版本
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function _Promise(handle){
    if (typeof handle !=='function') {
        throw new Error(`${handle} must be a function!`)
    }
    this._status = PENDING;   //设置初始状态
    this._value = null;		//设置初始值
    this.onFulfilledQueues = [];
    this.onRejectedQueues = [];

  	this._resolve = (val)=>{
        if(this._status !== PENDING) return 
        this._status = FULFILLED;
        this._value = val;
        this.onFulfilledQueues.pop()();
    }
    this._reject = (reason)=>{
        if(this._status !== PENDING) return 
        this._status = REJECTED;
        this._reason = reason;
        this.onRejectedQueues.forEach(fun=>fun());
    }
    try {
        handle(this._resolve.bind(this),this._reject.bind(this))
    } catch(err) {   
        this._reject(err)
    }
}

_Promise.prototype.then = function(onFulfilled,onRejected){
    let x;
    return new _Promise((resolve,reject)=>{
        if(this._status === PENDING){
            this.onFulfilledQueues.push(()=>{
                try {
                    x = onFulfilled(this._value);
                    if(x instanceof _Promise){             //改造version 4的地方
                        let then = x.then;
                        then.call(x,
                            y=>{ 
                                resolve(y)
                            },
                            n=>{
                                reject(n)
                            }
                        )
                    }else{
                        resolve(x)
                    }
                }catch (e){
                    reject(e)
                }
            });
            this.onRejectedQueues.push(()=>{
                try {
                    x=onRejected(this._reason);
                    if(x instanceof _Promise){  //改造version 4的地方
                        let then = x.then;
                        then.call(x,
                            y=>{ 
                                resolve(y)
                            },
                            n=>{
                                reject(n)
                            }
                        )
                    }else{
                        resolve(x)
                    }
                }catch (e){
                    reject(e)
                }
            });
        }

        if(this._status === FULFILLED){
            x=onFulfilled(this._value);
            resolve(x)
        }
        if(this._status === REJECTED){
            x=onRejected(this._reason);
            resolve(x)
        }
    })
}
```

在version 5中，我们主要改造了`_Promise.prototype.then`部分，如果第一个`.then`返回的是`_Promise`就把其成功的回调当成下一个`.then`的传入值。到此终于完成`.then`的链式调用了！！！

## 写在最后

本文涉及的`Promise`只是一小部分，但也算是完成`Promise`最重要部分的理解！代码可能不完美，但思路还算清晰！





















