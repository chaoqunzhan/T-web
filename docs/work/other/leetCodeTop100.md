
## 哈希
### 1. 两数之和
送人头了！！！
### 49. 字母异位词分组
方法一：哈希Map + 排序，单词根据排序作为哈希表的键
```js
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    const map = new Map()
    for(let i=0; i<strs.length; i++){
        const str = strs[i]
        const strSort = strs[i].split('').sort().join('')
        if(map.has(strSort)){
            map.set(strSort, [...map.get(strSort), str])
        }else{
            map.set(strSort, [str])
        }
    }
    return [...map.values()]
};
```

方法二：哈希Map + 计数，使用长度为26的数组记录每个字母出现的次数，使用该数组作为键
```js
// 不想写
```

### 128. 最长连续序列

方法一：哈希Set + 减枝
- 哈希Set去重复
- 从头遍历Set，元素x，如果存在x-1，则跳过，因为x-1的元素开头肯定更长
- 查找x+1，如果存在x+1，则长度+1
```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
    const set = new Set(nums)
    let longest = 0 //最长
    for(const num of set){
        if(!set.has(num-1)){
            let currNum = num
            let longcurr = 1 //目前元素为起点的长度
            while(set.has(currNum+1)){
                currNum ++
                longcurr ++
            }
            longest = Math.max(longcurr, longest)
        }
    }
    return longest
};
```

