
## 哈希（3）
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

## 双指针（4）
### 283. 移动零
方法一：暴力冒泡，两个for循环，0一直往后冒泡
```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    if(nums.length<2) return nums
    for(let i=0; i<nums.length; i++){
        for(let j=0; j<nums.length-1; j++){
            if(nums[j]==0){
                [nums[j],nums[j+1]] = [nums[j+1],nums[j]]
            }
        }
    }
    return nums
};
```
方法二：快慢指针，如果数组没有0，那么快慢指针始终指向同一个位置，每个位置自己和自己交换；如果数组有0，快指针先走一步，此时慢指针对应的就是0，所以要交换。
```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    let L = 0;
    let R = 0;
    while(R<nums.length){
        if(nums[R]!==0){
            [nums[L], nums[R]] = [nums[R], nums[L]] //交换
            L++
        }
        R++
    }
    return nums
};
```
### 11. 盛最多水的容器
方法: 双指针，左右指针分别指向数组两端，每次移动高度较小的指针，计算面积，更新最大面积
```js
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    let L = 0;
    let R = height.length-1;
    let res = 0
    while(L<R){
        const val = (R - L) * Math.min(height[L], height[R])
        res = Math.max(res, val)
        if(height[L] < height[R]){
            L++
        }else{
            R--
        }
    }
    return res
};
``` 
### 15. 三数之和
方法排序 + 一层循环 + 双指针
- 排序，从小到大
- 一层循环，固定一个数，双指针指向固定数后面的两端，如果和大于0，则右指针左移，如果和小于0，则左指针右移
- 注意跳过重复元素

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    let res = []
    //先排序
    nums.sort((a,b) => a-b)
    for(let i=0; i<nums.length; i++){
        //重复元素跳过
        if (i > 0 && nums[i] === nums[i - 1]){
            continue
        }
        let l = i+1; 
        let r = nums.length-1;
        while(l<r){
            if(nums[i]+nums[l]+nums[r]===0){
                res.push([nums[i], nums[l], nums[r]])
                l++
                r--
                //跳过重复元素
                while (l < r && nums[l] == nums[l - 1]) l++;
                while (l < r && nums[r] == nums[r + 1]) r--;
            }else if(nums[i]+nums[l]+nums[r]<0){
                l++
            }else{
                r--
            }
        }
    }
    return res
};
```

### 42. 接雨水

困难的TODO...


## 滑动窗口（2）
### 3. 无重复字符的最长子串
方法滑动窗口
- 用数组（队列）arr作为窗口，依次从头压入字符串s的字符
- 遇到相同字符就shift出arr的头元素，直到相同字符也被去掉
- 每次记录数组arr的长度做为返回值
```js
/**
 * @param {string} 
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    const n = s.length
    let i = 0
    let arr = []
    let res = 0
    while(i<n){
        if(!arr.includes(s[i])){
            arr.push(s[i])
            i++
        }else{
            while(arr[0]!==s[i]){
                arr.shift()
            }
            arr.shift()
        }
        res = Math.max(res, arr.length)
    }
    return res
};
```
### 438. 找到字符串中所有字母异位词
方法定长滑动窗口
- 使用长度为26的数组计数，记录p中字母出现的次数
- 使用长度为26的数组计数，记录队列q中字母出现的次数
- 滑动窗口，比较计数数组
注意：数组计数相比哈希计数减少时间复杂度
```js
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {
    if(s.length<p.length){
        return []
    }
    const res = []
    const qCount = new Array(26).fill(0)
    let queue = []

    const pCount = new Array(26).fill(0)
    for(let i=0; i<p.length; i++){
        pCount[p[i].charCodeAt()-'a'.charCodeAt()]++
    }

    for(let i=0; i<s.length; i++){
        queue.push(s[i])
        qCount[s[i].charCodeAt()-'a'.charCodeAt()]++

        if(queue.length===p.length){
            if(qCount.join('')===pCount.join('')){
                res.push(i-p.length+1)
            }
            const h = queue.shift()
            qCount[h.charCodeAt()-'a'.charCodeAt()]--
        }
    }
    return res
};
```

## 子串（3）
### 560. 和为K的子数组

### 239. 滑动窗口最大值
#### 题目

> 输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
>
> 输出：[3,3,5,5,6,7]

#### 方法
- 维护双向队列保存成员index
- 新元素入队前，从队尾pop出比新元素小的成员index
- 如果队列满了就从队头shift出最老的元素
- 每次队头就是窗口的最大值，保存下来

#### 代码
```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
    const res = []
    let queue = []
    for(let i=0; i<nums.length; i++){
        //维护双向队列（保存的元素的索引）
        while(queue.length>0 && nums[queue[queue.length-1]]<nums[i]){
            queue.pop()
        }
        queue.push(i)
        if(queue.length>0 && queue[0]<i-k+1){
            queue.shift()
        }        
        if(i>k-2){
            res.push(nums[queue[0]])
        }
    }
    return res
};
```
### 76，最小覆盖子串

## 普通数组（5）
### 53. 最大子数组和
#### 题目
> 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
>
> 输出：6

#### 方法
- 贪心算法
- 从头遍历用sum记录第i个元素前的元素和，如果sum>0就加上，否则抛弃
- 用ans记录每个位置的最大值，最终输出
#### 代码
```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let ans = nums[0]
    let sum = nums[0]
    for(let i=1; i<nums.length; i++){
        if(sum>0){
            sum = sum + nums[i]
        }else{
            sum = nums[i]
        }
        ans = Math.max(ans, sum)
    }
    return ans
};
```
### 56. 合并区间
#### 题目
> 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
> 
> 输出：[[1,6],[8,10],[15,18]]
> 
> 解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].

#### 方法
- 按左边界排序
- 如果区间重叠取右边界大的最为新的右边界
- 如果区间不重叠就加入结果数组
- 返回结果数组
#### 代码
```js
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    const intervalsSort = intervals.sort((a,b)=>{
        return a[0] - b[0]
    })
    const res = [intervalsSort[0]]
    for(let i=1; i<intervalsSort.length; i++){
        const [currStart, currEnd] = intervalsSort[i]
        const [prevStart, prevEnd] = res[res.length-1]
        if(currStart>prevEnd){
            res.push(intervalsSort[i])
        }else{
            res[res.length-1][1] = Math.max(prevEnd,currEnd)
        }
    }
    return res
};
```
### 189. 轮转数组
#### 题目
> 输入: nums = [1,2,3,4,5,6,7], k = 3
> 
> 输出: [5,6,7,1,2,3,4]
> 
> 解释:
> 
> 向右轮转 1 步: [7,1,2,3,4,5,6]
> 
> 向右轮转 2 步: [6,7,1,2,3,4,5]
> 
> 向右轮转 3 步: [5,6,7,1,2,3,4]
> 
#### 注意事项：
unshift的时间复杂度是O(n)
#### 方法
1、切片重组  
- 把n-k到n的元素插入到数组最前面


2、反转数组（利用首尾交换）
- 反转整个数组：[7,6,5,4,3,2,1]
- 反转0到k-1： [5,6,7,4,3,2,1]
- 反转k到n：   [5,6,7,1,2,3,4]
#### 代码
```js
//方法一：切片重组
var rotate = function(nums, k) {
    const n = nums.length;
    k = k % n; // 避免 k 大于数组长度的情况
    nums.splice(0, 0, ...nums.splice(n - k, k));// 切片重组
};

//方法二：反转数组
//TODO...

```

### 238. 除自身以外数组的乘积
#### 题目
>输入: nums = [1,2,3,4]
>
>输出: [24,12,8,6]
#### 方法
1、左右乘积列表：
- 一次循环维护L和R数组代表左右乘积
- 再次循环获取ans[i]=L[i]*R[i]

2、改进：用ans储存L和R降低空间复杂度（TODO）

3、改进：用双指针一次遍历（TODO）
#### 代码
```js
var productExceptSelf = function(nums) {
    let n = nums.length
    let L = new Array(n)
    let R = new Array(n)
    L[0] = 1
    R[n-1] = 1
    for(let i=1; i<nums.length; i++){
        L[i] = L[i-1] * nums[i-1]
        R[n-i-1] = R[n-i] * nums[n-i]
    }
    const ans = []
    for(let i=0; i<nums.length; i++){
        ans.push(L[i]*R[i])
    }
    return ans
};
```

## 矩阵（4）
### 73. 矩阵置零
#### 题目
> 输入：matrix = [[1,1,1],[1,0,1],[1,1,1]]
> 
> 输出：[[1,0,1],[0,0,0],[1,0,1]]
#### 方法
- 遍历一遍，找出有0的行号和列号，用两个set保存
- 再遍历一遍，遇到set中的行号和列号的元素置为0
- 优化：使用第一行和第一列替代set减少空间复杂度
#### 代码
```js
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function(matrix) {
    const zeroI = new Set()
    const zeroJ = new Set()
    for(let i=0; i<matrix.length; i++){
        const arr = matrix[i]
        for(let j=0; j<arr.length; j++){
            if(matrix[i][j]===0){
                zeroI.add(i)
                zeroJ.add(j)
            }
        }
    }
    for(let i=0; i<matrix.length; i++){
        const arr = matrix[i]
        for(let j=0; j<arr.length; j++){
            if(zeroI.has(i) || zeroJ.has(j)){
                matrix[i][j] = 0
            }
        }
    }
};
```
### 48. 旋转图像 
#### 题目
> 给定一个 n × n 的二维矩阵 matrix 表示一个图像。请你将图像顺时针旋转 90 度。你必须在 原地 旋转图像，这意味着你需要直接修改输入的二维矩阵。请不要 使用另一个矩阵来旋转图像。
#### 方法
矩阵转置 + 翻转
#### 代码
```js
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    const n = matrix.length
    //转置
    for(let i=0; i<n; i++){
        for(let j=i; j<n; j++){
            //这里的j从i开始避免重复交换
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
        }
    }
    //交换
    for(let i=0; i<n; i++){
        //这里的j只到n/2避免重复交换
        for(let j=0; j<n/2; j++){
            [matrix[i][j], matrix[i][n-j-1]] = [matrix[i][n-j-1], matrix[i][j]]
        }
    }
};
```
### 54. 螺旋矩阵
#### 题目
> 给你一个 m 行 n 列的矩阵 matrix ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素。
#### 方法
- 确定左右上下边界
- 每个方向遍历，并缩小边界
- 特殊处理剩下的单行或者单列(从right->left要判断是否还有行，从bottom->top要判断是否还有列)
#### 代码
```js
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
    const n = matrix.length;
    if (n === 0) return []; // 空矩阵直接返回空数组

    const m = matrix[0].length;
    const ans = [];
    let top = 0, bottom = n - 1;
    let left = 0, right = m - 1;

    while (top <= bottom && left <= right) {
        // 从左到右遍历上边界
        for (let j = left; j <= right; j++) {
            ans.push(matrix[top][j]);
        }
        top++; // 上边界向下移动

        // 从上到下遍历右边界
        for (let i = top; i <= bottom; i++) {
            ans.push(matrix[i][right]);
        }
        right--; // 右边界向左移动

        // 如果还有未遍历的行，从右到左遍历下边界
        if (top <= bottom) {
            for (let j = right; j >= left; j--) {
                ans.push(matrix[bottom][j]);
            }
            bottom--; // 下边界向上移动
        }

        // 如果还有未遍历的列，从下到上遍历左边界
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                ans.push(matrix[i][left]);
            }
            left++; // 左边界向右移动
        }
    }

    return ans;
};
```



### 240. 搜索二维矩阵 II
#### 题目

#### 方法

#### 代码

## 链表（14）
### 160. 相交链表
#### 题目
给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。
#### 方法
1、哈希Map存其中一个链表的节点，遍历另一个链表判断节点是否存在哈希Map中
- 缺点：空间复杂度高

2、双指针，pA指针从头走headA，pB指针从头走headB，走到尾就交换继续从头走，直到节点相遇就是香蕉节点了
- 记得处理不会相交的情况
#### 代码
```js
//不想写了
```
### 206. 反转链表
#### 题目
> 给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
#### 方法
1、直接迭代

2、可以使用递归，但是效率没有迭代高

#### 代码
```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    let prev = null
    let curr = head
    while(curr){
        const next = curr.next
        curr.next = prev
        prev = curr
        curr = next
    }
    return prev
};
```

### 234. 回文链表

#### 题目
> 给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。
#### 方法
1、转为数组，然后双指针

2、递归

3、快慢指针
- 找到前半部分链表的尾节点。
- 反转后半部分链表。
- 判断是否回文。
- 恢复链表。
- 返回结果。
#### 代码
```js
//TODO
```

### 141. 环形链表

#### 题目
> 给你一个链表的头节点 head ，判断链表中是否有环。
#### 方法
1、哈希表
- 空间复杂度高O(n)

2、快慢指针
- 一个指针一步，另一个两步，如果存在环就会相遇，空间复杂度O(1)

#### 代码
```js
//TODO
```
### 142. 环形链表 II

#### 题目
> 给定一个链表的头节点  head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。
#### 方法
1、哈希Map
- 以节点作为key，值为true
- 空间复杂度为O(n)

2、快慢指针
- 慢指针一步，快指针两步，找到首次重合的点
- 两个都是一步的指针分别从头和从重合点出发，交点就是答案了
- 注意判断空值的情况
#### 代码
```js
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
//1、哈希Map
var detectCycle = function(head) {
    let curr = head
    const map = new Map()
    while(curr){
        if(map.get(curr)){
            return curr
        }
        map.set(curr, true)
        curr = curr.next
    }
    return null
};

//2、快慢指针
var detectCycle = function(head) {
    let pA = head
    let pB = head
    let pTr = head
    while(pA && pB){
        if(!pA.next){
            return null
        }
        if(!pB.next || !pB.next.next){
            return null
        }
        pA = pA.next
        pB = pB.next.next
        if(pA===pB){
            while(pTr){
                if(pTr===pA){
                    return pTr
                }
                pA = pA.next
                pTr = pTr.next
            }
        }
    }
    return null
};
```
### 21. 合并两个有序链表

#### 题目
> 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
#### 方法
1、迭代

2、递归

#### 代码
```js
//迭代
var mergeTwoLists = function(list1, list2) {
    const head = new ListNode(null)
    let node = head
    while(list1&&list2){
        if(list1.val <= list2.val){
            node.next = list1
            list1 = list1.next
            node = node.next
        }else{
            node.next = list2
            list2 = list2.next
            node = node.next
        }
    }
    if(list1){
        node.next = list1
    }
    if(list2){
        node.next = list2
    }
    return head.next
};
```

### 2. 两数相加

#### 题目
> 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。请你将两个数相加，并以相同形式返回一个表示和的链表。你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

> 输入：l1 = [2,4,3], l2 = [5,6,4]
> 
> 输出：[7,0,8]
> 
> 解释：342 + 465 = 807.
#### 方法
1、迭代

#### 代码
```js
var addTwoNumbers = function(l1, l2) {
    let node = new ListNode(null)
    const head = node
    let temp = 0
    while(l1 || l2 || temp){
        let val1 = l1 ? l1.val : 0
        let val2 = l2 ? l2.val : 0
        const sum = val1 + val2 + temp
        temp = Math.floor(sum / 10)
        const value = sum % 10
        node.next = new ListNode(value)
        node = node.next
        if(l1) l1 = l1.next
        if(l2) l2 = l2.next
    }
    return head.next
};
```

### 19. 删除链表的倒数第 N 个结点

#### 题目
> 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
#### 方法


#### 代码
```js
var addTwoNumbers = function(l1, l2) {
    
};
```

### 

#### 题目
> 
#### 方法


#### 代码
```js


```