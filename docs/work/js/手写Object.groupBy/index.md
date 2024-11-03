# 手写 Object.groupBy

### 输入：
```js
const items = [
    {
      id: 1,
      kind: 'a',
    },
    {
      id: 2,
      kind: 'b',
    },
    {
      id: 3,
      kind: 'a',
    }
]
const groups = Object.groupBy(items, ({kind}) => kind)
```

### 输出：
```js
{
    a:  [ 
        { id: 1, kind: 'a' }, 
        { id: 3, kind: 'a' } 
    ],
    b:  [ 
        { id: 2, kind: 'b' } 
    ]
}
```

### 实现代码：
```js
Object.prototype.myGroupBy = function (items,callback) {
    return items.reduce((acc,cur)=>{
        const key = callback(cur)
        if(!acc[key]){
            acc[key] = []
        }
        acc[key].push(cur)
        return acc
    },{})
}
```