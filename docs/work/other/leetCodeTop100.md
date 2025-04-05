
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
1、计算链表长度

2、栈

3、双指针

#### 代码
```js
var removeNthFromEnd = function(head, n) {
    let dumy = new ListNode()
    dumy.next = head
    let frist = dumy
    let second = dumy
    let i = 0
    let j = 0 - n - 1
    while(!!frist){
        frist = frist.next
        if(j>=0){
            second = second.next
        }
        i++
        j++
    }
    second.next = second.next.next
    let resNode = dumy.next
    dumy.next = null  //释放影子节点
    return resNode
};
```

### 24. 两两交换链表中的节点

#### 题目
> 给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

> 输入：head = [1,2,3,4]
> 
> 输出：[2,1,4,3]
#### 方法
1、迭代
- 新建dumyNode->head
- 用tempNode表示当前位置，交换tempNode.next和tempNode.next.next
- 交换完成tempNode指向tempNode.next.next

2、递归
- 新建dumyNode->head
- 交换head和head.next
- head->swapPairs(head.next)

#### 代码
```js
/**
 * 迭代
 * @param {ListNode} head
 * @return {ListNode}
 */
var swapPairs = function(head) {
    if(!head || !head.next) return head
    const dumyNode = new ListNode()
    dumyNode.next = head
    let tempNode = dumyNode
    while(tempNode && tempNode.next && tempNode.next .next){
        const nodeA = tempNode.next
        const nodeB = nodeA.next
        tempNode.next = nodeB
        nodeA.next = nodeB.next 
        nodeB.next = nodeA
        //下一步
        tempNode = tempNode.next.next
    }
    return dumyNode.next
};

/**
 * 递归
 * @param {ListNode} head
 * @return {ListNode}
 */
var swapPairs = function(head) {
    if(!head || !head.next) return head
    const dumyNode = new ListNode()
    dumyNode.next = head
    let nodeA = head
    let nodeB = nodeA.next
    nodeA.next = swapPairs(nodeB.next)
    dumyNode.next = nodeB
    nodeB.next = nodeA
    return dumyNode.next
};
```
### 25. K个一组的翻转链表

#### 题目
> 给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。

#### 方法
1、迭代

2、递归

#### 代码
```js
//TODO
```

### 138. 随机链表的复制

#### 题目
> 
#### 方法


#### 代码
```js


```


### 148.排序链表

#### 题目
> 给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。

> 进阶：你可以在 O(n log n) 时间复杂度和常数级空间复杂度下，对链表进行排序吗？
#### 方法
1、自顶向下归并排序
- 对链表自顶向下归并排序的过程如下。
- 找到链表的中点，以中点为分界，将链表拆分成两个子链表。寻找链表的中点可以使用快慢指针的做法。
- 对两个子链表分别排序。
- 将两个排序后的子链表合并，得到完整的排序后的链表。


2、自底向上归并排序
- 使用自底向上的方法实现归并排序，则可以达到 O(1) 的空间复杂度。

#### 代码
```js
// 1、自顶向下归并排序
var sortList = function(head) {
    //退出递归条件
    if(!head || !head.next){
        return head
    }

    //快慢指针寻找中间节点
    const dumyHead = new ListNode(0)
    dumyHead.next = head
    let slowNode = dumyHead
    let fastNode = head
    while(fastNode && fastNode.next){
        slowNode = slowNode.next
        fastNode = fastNode.next.next
    }
    const midNode = slowNode.next //找到中间位置节点
    slowNode.next = null //记得断开链表！！！

    let nodeA = sortList(head)
    let nodeB = sortList(midNode)

    //合并两个有序链表
    let dumyNode = new ListNode(0)
    let currNode = dumyNode
    while(nodeA && nodeB){
        if(nodeA.val>nodeB.val){
            currNode.next = nodeB
            nodeB = nodeB.next
        }else{
            currNode.next = nodeA
            nodeA = nodeA.next
        }
        currNode = currNode.next
    }
    if(nodeA) currNode.next = nodeA
    if(nodeB) currNode.next = nodeB
    return dumyNode.next
};

//1、自底向上归并排序
const merge = (head1, head2) => {
    const dummyHead = new ListNode(0);
    let temp = dummyHead, temp1 = head1, temp2 = head2;
    while (temp1 !== null && temp2 !== null) {
        if (temp1.val <= temp2.val) {
            temp.next = temp1;
            temp1 = temp1.next;
        } else {
            temp.next = temp2;
            temp2 = temp2.next;
        }
        temp = temp.next;
    }
    if (temp1 !== null) {
        temp.next = temp1;
    } else if (temp2 !== null) {
        temp.next = temp2;
    }
    return dummyHead.next;
}

var sortList = function(head) {
    if (head === null) {
        return head;
    }

    //计算长度
    let length = 0;
    let node = head;
    while (node !== null) {
        length++;
        node = node.next;
    }
    const dummyHead = new ListNode(0, head);
    //subLength <<= 1：左移，1，2，4，8
    for (let subLength = 1; subLength < length; subLength <<= 1) {
        let prev = dummyHead, curr = dummyHead.next;
        while (curr !== null) {
            let head1 = curr;
            for (let i = 1; i < subLength && curr.next !== null; i++) {
                curr = curr.next;
            }
            let head2 = curr.next;
            curr.next = null;
            curr = head2;
            for (let i = 1; i < subLength && curr != null && curr.next !== null; i++) {
                curr = curr.next;
            }
            let next = null;
            if (curr !== null) {
                next = curr.next;
                curr.next = null;
            }
            const merged = merge(head1, head2);
            prev.next = merged;
            while (prev.next !== null) {
                prev = prev.next;
            }
            curr = next;
        }
    }
    return dummyHead.next;
};

```

### 23. 合并K个生序链表

#### 题目
> 
#### 方法


#### 代码
```js


```

### 146. LRU缓存

#### 题目
> 如题
#### 方法
1、哈希Map
- 利用js保存插入顺序的特性

2、哈希 + 双向链表
- 使用一个哈希表（Map）来存储键值对，以便快速查找。
- 使用一个双向链表（Doubly Linked List）来维护数据的访问顺序，最近访问的节点放在链表头部，最久未访问的节点放在链表尾部
#### 代码
```js
/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    this.cache = new Map(); // 使用Map保持插入顺序
    this.maxSize = capacity; // 缓存的最大容量
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (!this.cache.has(key)) {
        return -1 
    }
    const value = this.cache.get(key);
    // 更新key为最新访问
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    if (this.cache.has(key)) {
        // 如果键已存在，先删除旧的
        this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
        // 如果超过最大容量，移除最早使用的元素
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
    }
    // 添加新值或更新已有键的值，并将其标记为最新访问
    this.cache.set(key, value);
};




//2、哈希 + 双向链表
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity; // 缓存容量
        this.map = new Map(); // 哈希表存储键值对
        this.head = new ListNode(); // 虚拟头节点
        this.tail = new ListNode(); // 虚拟尾节点
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    // 获取值
    get(key) {
        if (!this.map.has(key)) return -1;

        const node = this.map.get(key);
        this.moveToHead(node); // 将节点移到链表头部
        return node.value;
    }

    // 插入或更新值
    put(key, value) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            node.value = value; // 更新值
            this.moveToHead(node); // 将节点移到链表头部
        } else {
            const newNode = new ListNode(key, value); // 创建新节点
            this.map.set(key, newNode); // 添加到哈希表
            this.addToHead(newNode); // 将新节点添加到链表头部

            if (this.map.size > this.capacity) {
                const tailNode = this.removeTail(); // 移除链表尾部节点
                this.map.delete(tailNode.key); // 从哈希表中删除对应键
            }
        }
    }

    // 将节点移到链表头部
    moveToHead(node) {
        this.removeNode(node); // 先移除节点
        this.addToHead(node); // 再添加到头部
    }

    // 添加节点到链表头部
    addToHead(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }

    // 移除节点
    removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    // 移除链表尾部节点
    removeTail() {
        const tailNode = this.tail.prev;
        this.removeNode(tailNode);
        return tailNode;
    }
}

// 定义链表节点类
class ListNode {
    constructor(key = null, value = null) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

```

## 二叉树（15）
### 94. 二叉树的中序遍历（简单）

#### 题目
> 给定一个二叉树的根节点 root ，返回 它的 中序 遍历 。
#### 方法
1、递归

2、迭代

注：递归的时候隐式地维护了一个栈，在迭代的时候需要显式地将这个栈模拟出来
#### 代码
```js
/**
 * 递归
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    if(root==null) return []
    var res = []
    var inorder = function(node){
        if(!node) return
        inorder(node.left)
        res.push(node.val)
        inorder(node.right)
    }
    inorder(root)
    return res
};

/**
 * 迭代
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    const res = [];
    const stk = [];
    while (root || stk.length) {
        while (root) {
            stk.push(root);
            root = root.left;
        }
        root = stk.pop();
        res.push(root.val);
        root = root.right;
    }
    return res;
};

```

### 104. 二叉树的最大深度（简单）

#### 题目
> 给定一个二叉树 root ，返回其最大深度。
#### 方法
1、深度优先搜索
- 递归

2、广度优先搜索
- 迭代
- 维护一个队列，存每层的节点，一层处理完深度加1
#### 代码
```js
/**
 * 深度优先搜索，递归
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    if(!root) return 0
    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1
};

/**
 * 广度优先搜索，迭代
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    if (!root) return 0; // 如果树为空，深度为 0
    const queue = [root]; // 初始化队列，将根节点加入队列
    let depth = 0; // 初始化深度
    while (queue.length > 0) {
        depth++; // 每处理一层，深度加 1
        const levelSize = queue.length; // 当前层的节点数
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift(); // 取出队列中的第一个节点
            // 将左右子节点加入队列（如果存在）
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    return depth; // 返回最大深度
};

```
### 226. 翻转二叉树（简单）
#### 题目
> 给你一棵二叉树的根节点 root ，翻转这棵二叉树，并返回其根节点。
#### 方法
递归
#### 代码
```js
/**
 * 递归
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if(!root){
        return root
    }
    [root.left, root.right] = [root.right, root.left]
    invertTree(root.left)
    invertTree(root.right)
    return root
};
```

### 101. 对称二叉树（简单）
#### 题目
> 给你一个二叉树的根节点 root ， 检查它是否轴对称。
#### 方法
问题转化为左右两棵树
- 它们的两个根结点具有相同的值
- 每个树的右子树都与另一个树的左子树镜像对称

1、递归

2、迭代

#### 代码
```js
/** 
 * 递归
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
    if(!root) return true
    let left = root.left
    let right = root.right
    var check = function(p, q){
        if (!p && !q) return true;
        if (!p || !q) return false;
        return p.val === q.val && check(p.left, q.right) && check(q.left, p.right)
    }
    return check(left, right)
};

/** 
 * 迭代 TODO
 * @param {TreeNode} root
 * @return {boolean}
 */

```

### 543.二叉树的直径（简单）
#### 题目
> 给你一棵二叉树的根节点，返回该树的 直径 。
#### 方法
> 二叉树的 直径 是指树中任意两个节点之间最长路径的 长度 。这条路径可能经过也可能不经过根节点 root 。
> 
> 两节点之间路径的 长度 由它们之间边数表示。

- 深度优先遍历
- maxDepth记录遍历过的节点的最大深度
- dfs返回遍历的节点的单边深度（比较长的子树：左子树或右子树）
#### 代码
```js
/**
 * @param {TreeNode} root
 * @return {number}
 */
var diameterOfBinaryTree = function(root) {
    let maxDepth = 0
    let dfs = function(node){
        if(!node) return 0
        let leftDepth = dfs(node.left)
        let rightDepth = dfs(node.right)
        maxDepth = Math.max(maxDepth, leftDepth+rightDepth)
        return Math.max(leftDepth, rightDepth) + 1
    }
    dfs(root)
    return maxDepth
};
```
### 102. 二叉树的层序遍历（中等）
#### 题目
> 给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）。
#### 方法
层序遍历
- 逐层把数据保存下来
- levelSize = queue.length不能直接queue.length
#### 代码
```js
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(!root) return []
    const ans = []
    const queue = [root]
    while(queue.length>0){
        const arr = []
        const levelSize = queue.length;
        for(let i=0; i<levelSize; i++){
            const node = queue.shift()
            arr.push(node.val)
            if(node.left) queue.push(node.left)
            if(node.right) queue.push(node.right)
        }
        ans.push(arr)
    }
    return ans
};
```
### 108. 将有序数组转换为二叉搜索树
#### 题目
> 给你一个整数数组 nums ，其中元素已经按 升序 排列，请你将其转换为一棵 平衡 二叉搜索树。

> 二叉搜索树：
- 左子树的所有节点的值小于该节点的值。
- 右子树的所有节点的值大于该节点的值。
- 左子树和右子树也必须分别是二叉搜索树。
#### 方法
中序遍历
#### 代码
```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/*+*
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function(nums) {
    let root = null
    let BST = function(start, end){
        if(start > end) return
        let mid = Math.floor((start + end) / 2)
        let left = BST(start, mid - 1)
        let right = BST(mid + 1, end)
        let node = new TreeNode(nums[mid], left, right)
        return node
    }
    root = BST(0, nums.length-1)
    return root
};
```
### 98. 验证二叉搜索树（中等）
#### 题目
> 给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。
> 
> 有效 二叉搜索树定义如下：
- 节点的左子树只包含 小于 当前节点的数。
- 节点的右子树只包含 大于 当前节点的数。
- 所有左子树和右子树自身必须也是二叉搜索树。
#### 方法
中序遍历为升序
#### 代码
```js
var isValidBST = function(root) {
    let prev = null; // 记录中序遍历中的前一个节点值
    // 定义递归函数
    const inOrderTraversal = (node) => {
        if (!node) return true; // 空节点始终满足 BST 条件
        // 检查左子树
        if (!inOrderTraversal(node.left)) return false;
        // 检查当前节点是否满足 BST 条件
        if (prev !== null && node.val <= prev) return false;
        prev = node.val; // 更新前一个节点值
        // 检查右子树
        return inOrderTraversal(node.right);
    };
    // 从根节点开始递归
    return inOrderTraversal(root);
};
```
### 230. 二叉搜索树中第K小的元素（中等）
#### 题目
> 给定一个二叉搜索树的根节点 root ，和一个整数 k ，请你设计一个算法查找其中第 k 小的元素（从 1 开始计数）。
#### 方法
用个标记index记录一下，中序遍历到index=k
#### 代码
```js
var kthSmallest = function(root, k) {
    let res = NaN
    let index = 0
    let kth = function(node){
        if(!node) return
        kth(node.left)
        index++
        if(index===k){
            res = node.val
        }
        kth(node.right)
    }
    kth(root)
    return res
};
```
### 230. 二叉树的右视图
#### 题目
> 给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
#### 方法
层序遍历，返回每层的最后一个元素
#### 代码
```js
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function(root) {
    if(!root) return []
    const res = []
    const queue = [root]
    while(queue.length>0){
        const levelLength = queue.length
        for(let i=0; i<levelLength; i++){
            const node = queue.shift()
            if(node.left) queue.push(node.left)
            if(node.right) queue.push(node.right)
            if(i===levelLength-1){
                res.push(node.val)
            }
        }
    }
    return res
};
```
### 114. 二叉树展开为链表
#### 题目
> 给你二叉树的根结点 root ，请你将它展开为一个单链表：
> 
> 展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。
> 展开后的单链表应该与二叉树 先序遍历 顺序相同。

#### 方法
1、先序遍历 + 数组

2、后序遍历：
- 左右子树交换
- 右子树接到左子树的最右子树
#### 代码
```js
/**
 * 先序遍历 + 数组
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function(root) {
    let list = []
    let flat = function(node){
        if(!node) return
        list.push(node)
        flat(node.left)
        flat(node.right)
    }
    flat(root)
    let resNode = null
    for(let i=1; i<list.length; i++){
        let prev = list[i-1]
        let curr = list[i]
        prev.left = null
        prev.right = curr
    }
};

/**
 * 后序遍历
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function(root) {
    if(!root) return
    flatten(root.left)
    flatten(root.right)
    if(root.left){
        let pre = root.left
        //找到pre的最右子树
        while(pre.right){
            pre = pre.right
        }
        pre.right = root.right
        root.right = root.left
        root.left = null
    }
    root = root.right
};
```

### 105. 从前序与中序遍历序列构造二叉树（中等）
#### 题目
> 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历， inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。

#### 方法

#### 代码
```js

```

### 
#### 题目


#### 方法

#### 代码
```js

```

### 
#### 题目


#### 方法

#### 代码
```js

```

### 
#### 题目


#### 方法

#### 代码
```js

```

### 
#### 题目


#### 方法

#### 代码
```js

```

### 
#### 题目


#### 方法

#### 代码
```js

```

## 图论（4）

## 回溯（8）
### 46. 全排列
#### 题目
> 给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。

> 输入：nums = [1,2,3]
> 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
#### 方法
回溯模版
- 定义trackback方法
- trackback中定义返回条件
- trackback中for循环调用trackback
- 引入标记位减枝

#### 代码
```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
    var ans = []
    var backtrack = function(arr, used){
        if(arr.length === nums.length){
            ans.push(arr)
            return
        }
        for(let i=0; i<nums.length; i++){
            if(!used[nums[i]]){
                used[nums[i]] = true
                backtrack([...arr, nums[i]], used)
                used[nums[i]] = false
            }
        }
    }
    backtrack([], {})
    return ans
};
```

### 78.子集（中等）

#### 题目
> 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
> 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。

> 输入：nums = [1,2,3]
> 输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
#### 方法

#### 代码
```js
var subsets = function(nums) {
    const ans = []
    const trackback = function(arr, startIndex){
        //这里不需要返回条件
        ans.push(arr)
        for(let i=startIndex; i<nums.length; i++){
            trackback([...arr, nums[i]], i+1)
        }
    }
    trackback([], 0)
    return res
}
```

### 17. 电话号码的字母组合
#### 题目

#### 方法

#### 代码
```js

```

### 39. 组合总和
#### 题目
> 输入：candidates = [2,3,6,7], target = 7
> 
> 输出：[[2,2,3],[7]]
> 
> 解释：
> 
> 2 和 3 可以形成一组候选，2 + 2 + 3 = 7 。注意 2 可以使用多次。
> 7 也是一个候选， 7 = 7 。
> 仅有这两种组合。

#### 方法
- 回溯，每次更新目标值
- 去重, 使用statIndex
#### 代码
```js
var combinationSum = function(candidates, target) {
    const ans = []
    const trackback = function(arr, start, tar){
        if(tar===0){
            ans.push(arr)
            return
        }
        if(tar<0){
            return
        }
        for(let i=start; i<candidates.length; i++){
            trackback([...arr, candidates[i]], i, tar-candidates[i])
        }
    }
    trackback([], 0, target)
    return ans
}
```

### 22. 括号生成（中等，不会）
#### 题目
> 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。

#### 方法

#### 代码
```js
var generateParenthesis = function(n) {
    const ans = [];
    // 定义回溯函数
    const backtrack = (str, leftCount, rightCount) => {
        // 终止条件：如果字符串长度达到 2n，则保存结果
        if (str.length === 2 * n) {
            ans.push(str);
            return;
        }
        // 添加左括号的条件：左括号数量不能超过 n
        if (leftCount < n) {
            backtrack(str + '(', leftCount + 1, rightCount);
        }
        // 添加右括号的条件：右括号数量不能超过左括号数量
        if (rightCount < leftCount) {
            backtrack(str + ')', leftCount, rightCount + 1);
        }
    };
    // 从空字符串开始递归
    backtrack('', 0, 0);
    return ans;
};
```

### 79. 单词搜索
#### 题目
> 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。
>
> 单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。
#### 方法

#### 代码
```js
var exist = function(board, word) {
    const m = board.length
    const n = board[0].length
    //逐行初始化，注意！！！
    const used = Array.from({ length: m }, () => new Array(n).fill(false))
    let ans = false
    const trackback = function(str, used, row, col){
        if(str.length>0 && str[str.length-1]!==word[str.length-1]){
            return
        }
        if(str === word){
            ans = true
            return 
        }
        if(str.length===0){
            for(let i=0; i<m; i++){
                for(let j=0; j<n; j++){
                    if(!used[i][j]){
                        used[i][j] = true
                        trackback(str+board[i][j], used, i, j)
                        used[i][j] = false
                    }
                }
            }
        }else{
            //上
            if(row-1>=0 && !used[row-1][col]){
                used[row-1][col] = true
                trackback(str+board[row-1][col], used, row-1, col)
                used[row-1][col] = false
            }
            //下
            if(row+1<m && !used[row+1][col]){
                used[row+1][col] = true
                trackback(str+board[row+1][col], used, row+1, col)
                used[row+1][col] = false
            }
            //左
            if(col-1>=0 && !used[row][col-1]){
                used[row][col-1] = true
                trackback(str+board[row][col-1], used, row, col-1)
                used[row][col-1] = false
            }
            //右
            if(col+1<n && !used[row][col+1]){
                used[row][col+1] = true
                trackback(str+board[row][col+1], used, row, col+1)
                used[row][col+1] = false
            }
        }
    }
    trackback('', used, 0, 0)
    return ans
}
```
### 
#### 题目


#### 方法

#### 代码
```js

```
### 
#### 题目


#### 方法

#### 代码
```js

```

## 二分查找（6）
### 35. 搜索插入位置（简单）
#### 题目
> 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
> 
> 请必须使用时间复杂度为 O(log n) 的算法。

#### 方法

#### 代码
```js
var searchInsert = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while(left<=right){
        let mid = Math.round((left+right)/2)
        if(nums[mid]<target){
            left = mid + 1
        }else{
            right = mid - 1
        }
    }
    return left
};
```

### 74. 搜索二维矩阵（中等）
#### 题目
> 给你一个满足下述两条属性的 m x n 整数矩阵：
> 
> 每行中的整数从左到右按非严格递增顺序排列。
> 每行的第一个整数大于前一行的最后一个整数。
> 给你一个整数 target ，如果 target 在矩阵中，返回 true ；否则，返回 false 。

#### 方法

#### 代码
```js
var searchMatrix = function(matrix, target) {
    let m = matrix[0].length - 1;
    let n = matrix.length - 1;
    let leftX = 0, leftY = 0;
    let rightX = m, rightY = n;
    while(leftY<rightY){
        let midY = Math.round((leftY + rightY)/2);
        if(matrix[midY][0]===target){
            return true
        }else if(matrix[midY][0]<target){
            leftY = midY;
        }else{
            rightY = midY - 1;
        }
    }
    while(leftX<=rightX){
        let midX = Math.round((leftX + rightX)/2);
        if(matrix[leftY][midX] === target) {
            return true
        }else if(matrix[leftY][midX]<target){
            leftX = midX + 1;
        }else{
            rightX = midX - 1;
        }
    }
    return false
};
```

### 34. 在排序数组中查找元素的第一个和最后一个位置（中等）
#### 题目
> 给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。
> 
> 如果数组中不存在目标值 target，返回 [-1, -1]。
> 
> 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。

#### 方法
两个二分查找

- 查找左边：
- 查找右边：
#### 代码
```js
var searchRange = function(nums, target) {
    // 查找目标值的第一个位置
    const searchLeft = () => {
        let l = 0;
        let r = nums.length - 1;
        let ans = -1; // 默认返回 -1
        while (l <= r) {
            const m = Math.floor((l + r) / 2);
            if (nums[m] < target) {
                l = m + 1;
            } else {
                r = m - 1;
                if (nums[m] === target) ans = m; // 更新答案
            }
        }
        return ans;
    };
    // 查找目标值的最后一个位置
    const searchRight = () => {
        let l = 0;
        let r = nums.length - 1;
        let ans = -1; // 默认返回 -1
        while (l <= r) {
            const m = Math.floor((l + r) / 2);
            if (nums[m] <= target) {
                l = m + 1;
                if (nums[m] === target) ans = m; // 更新答案
            } else {
                r = m - 1;
            }
        }
        return ans;
    };
    // 分别调用两个函数
    const left = searchLeft();
    const right = searchRight();
    return [left, right];
};
```

### 33. 搜索旋转排序数组（中等）
#### 题目
> 输入：nums = [4,5,6,7,0,1,2], target = 0
> 
> 输出：4

#### 方法
二分查找

- 其中一边是有序的
- 以有序的一边为判断条件
- 注意边界

#### 代码
```js
var search = function(nums, target) {
    let l = 0;
    let r = nums.length - 1;
    while(l<=r){
        const m = Math.floor((l+r)/2)
        if(nums[m]===target){
            return m
        }
        //左边有序
        if(nums[m]>=nums[l]){
            if(nums[m]>target && nums[l]<=target){
                r = m - 1
            }else{
                l = m + 1
            }
        }
        //右边有序
        else{
            if(nums[m]<target && nums[r]>=target){
                l = m + 1
            }else{
                r = m - 1
            }
        }
    }
    return -1
};
```

### 153. 寻找旋转排序数组中的最小值（中等）
#### 题目
> 给你一个元素值 互不相同 的数组 nums ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 最小元素 。
> 
> 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。


> 输入：nums = [3,4,5,1,2]
> 
> 输出：1
> 
> 解释：原数组为 [1,2,3,4,5] ，旋转 3 次得到输入数组。

#### 方法
二分查找

- 如果中间值小于右边界值，则最小值在 [l, m] 范围内
- 否则，最小值在[m + 1, r] 
#### 代码
```js
var findMin = function(nums) {
    let l = 0;
    let r = nums.length - 1;
    while (l < r) {
        const m = Math.floor((l + r) / 2);
        // 如果中间值小于右边界值，则最小值在 [l, m] 范围内
        if (nums[m] < nums[r]) {
            r = m; // 缩小范围到 [l, m]
        } 
        // 如果中间值大于右边界值，则最小值在 [m + 1, r] 范围内
        else {
            l = m + 1; // 缩小范围到 [m + 1, r]
        }
    }
    // 循环结束后，l 和 r 相等，指向最小值
    return nums[l];
};
```

### 4. 寻找两个正序数组的中位数（困难，不会啊）
#### 题目
> 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。
> 
> 算法的时间复杂度应该为 O(log (m+n)) 。

> 输入：nums1 = [1,3], nums2 = [2]
> 输出：2.00000
> 解释：合并数组 = [1,2,3] ，中位数 2

> 输入：nums1 = [1,2], nums2 = [3,4]
> 输出：2.50000
> 解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
#### 方法

#### 代码
```js
var findMedianSortedArrays = function(nums1, nums2) {

}
```

## 栈（5）
### 20. 有效的括号（简单）
#### 题目
> 输入：s = "()[]{}"
> 
> 输出：true
#### 方法
直接码
#### 代码
```js
var isValid = function(s) {
    const stk = []
    var isFit = function(s1, s2){
        return ((s1==='(' && s2===')') || (s1==='[' && s2===']') || (s1==='{' && s2==='}'))
    }
    for(let i=0; i<s.length; i++){
        if(stk.length>0 && isFit(stk[stk.length-1], s[i])){
            stk.pop()
        }else{
            stk.push(s[i])
        }
    }
    return stk.length===0
};
```

### 155. 最小栈（中等）
#### 题目
> 设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。

> 实现 MinStack 类:  
> - MinStack() 初始化堆栈对象。  
> - void push(int val) 将元素val推入堆栈。  
> - void pop() 删除堆栈顶部的元素。  
> - int top() 获取堆栈顶部的元素。  
> - int getMin() 获取堆栈中的最小元素。  

> 输入：  
> ["MinStack","push","push","push","getMin","pop","top","getMin"]  
> [[],[-2],[0],[-3],[],[],[],[]]  
> 输出：  
> [null,null,null,null,-3,null,0,-2]
#### 方法
- 辅助栈储存最小元素
- 判空：throw new Error("Stack is empty");
#### 代码
```js
var MinStack = function() {
    this.stk = []; // 主栈，用于存储所有元素
    this.min_stk = []; // 辅助栈，用于存储当前最小值
};

/** 
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function(val) {
    // 将元素压入主栈
    this.stk.push(val);

    // 如果辅助栈为空，或者新元素小于等于当前最小值，则将其压入辅助栈
    if (this.min_stk.length === 0 || val <= this.min_stk[this.min_stk.length - 1]) {
        this.min_stk.push(val);
    }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
    // 从主栈弹出元素
    const topVal = this.stk.pop();

    // 如果弹出的元素是最小值，则也从辅助栈中弹出
    if (topVal === this.min_stk[this.min_stk.length - 1]) {
        this.min_stk.pop();
    }
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    // 返回主栈的栈顶元素
    if (this.stk.length === 0) {
        throw new Error("Stack is empty");
    }
    return this.stk[this.stk.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    // 返回辅助栈的栈顶元素，即当前最小值
    if (this.min_stk.length === 0) {
        throw new Error("Stack is empty");
    }
    return this.min_stk[this.min_stk.length - 1];
};

/** 
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
```

### 
#### 题目


#### 方法

#### 代码
```js

```

### 
#### 题目


#### 方法

#### 代码
```js

```

### 
#### 题目


#### 方法

#### 代码
```js

```
## 堆（3）
### 
#### 题目


#### 方法

#### 代码
```js

```

## 贪心算法（4）
### 
#### 题目


#### 方法

#### 代码
```js

```


## 动态规划（10）

### 70. 爬楼梯（简单）
#### 题目
> 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
> 
> 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

#### 方法
递推公式：f(x)=f(x−1)+f(x−2)
#### 代码
```js
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    let dp = new Array(n+1).fill(0)
    dp[1] = 1
    dp[2] = 2
    for(let i=3; i<n+1; i++){
        dp[i] = dp[i-1] + dp[i-2]
    }
    return dp[n]
};

//优化空间复杂度
var climbStairs = function(n) {
    let p = 0, q = 0, r = 1;
    for (let i = 1; i <= n; ++i) {
        p = q;
        q = r;
        r = p + q;
    }
    return r;
};
```

### 198. 打家劫舍（中等）
#### 题目
> 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
> 
> 给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。

#### 方法
递推公式：f(x) = max(f(x-2)+nums[x], f(x-1))
#### 代码
```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    const n = nums.length + 1
    const dp = new Array(n).fill(0)
    dp[1] = nums[0]
    dp[2] = Math.max(nums[0], nums[1])
    for(let i=3; i<=n; i++){
        dp[i] = Math.max(dp[i-2] + nums[i-1], dp[i-1])
    }
    return dp[n-1]
};

/** 优化内存
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    const n = nums.length + 1
    const dp = new Array(n).fill(0)
    dp[1] = nums[0]
    dp[2] = Math.max(nums[0], nums[1])
    let d = dp[1]
    let p = dp[2]
    for(let i=3; i<=n; i++){
        dp[i] = Math.max(d + nums[i-1], p)
        d=p
        p=dp[i]
    }
    return dp[n-1]
};
```

