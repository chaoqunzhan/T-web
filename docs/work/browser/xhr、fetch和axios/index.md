## XHR、fetch和axios的区别？
这三者都是前端用来发起网络请求（HTTP Request）的工具，但它们处于不同的**演化阶段**和**抽象层级**。

简单来说：

* **XHR:** 上一代的元老，由浏览器原生提供，用法繁琐（回调地狱）。
* **Fetch:** 现代的继任者，由浏览器原生提供，基于 Promise，更底层。
* **Axios:** 最好用的第三方库，封装了 XHR/Http，功能最全（拦截器、自动转换），开发体验最佳。

---

### 1. 核心特性对比表

| 特性 | XMLHttpRequest (XHR) | Fetch API | Axios |
| --- | --- | --- | --- |
| **来源** | 浏览器原生对象 | 浏览器原生 API | 第三方库 (需 npm 安装) |
| **底层机制** | 事件驱动 (Event-based) | 基于 Promise | 浏览器用 XHR (默认), Node用 Http |
| **语法风格** | 繁琐，回调函数 | 链式调用，较为简洁 | 链式调用，最简洁 |
| **JSON 处理** | 手动 `JSON.parse()` | 手动 `await res.json()` | **自动**处理 |
| **错误处理** | 网络错和状态码错都需手动判断 | **只在网络断开时 Reject** (404/500 算成功) | 状态码非 2xx 会自动 Reject |
| **请求拦截** | 无，需自己封装 | 无，需覆盖全局 fetch | **支持拦截器** (核心优势) |
| **进度监控** | 支持上传/下载进度 (`onprogress`) | 仅支持下载流，上传进度不支持 | 支持上传/下载进度 |
| **取消请求** | `xhr.abort()` | `AbortController` | `AbortController` |
| **体积** | 0 KB | 0 KB | 约 10-20 KB |

---

### 2. 代码写法直观对比

为了发送一个 POST 请求并处理 JSON，三者的代码量和复杂度区别很大：

#### 1. XMLHttpRequest (XHR) - “远古时代”

写法非常松散，需要记忆 `readyState` 的状态码。

```javascript
const xhr = new XMLHttpRequest();
xhr.open('POST', '/api/user');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) { // 请求完成
    if (xhr.status >= 200 && xhr.status < 300) {
      // 成功，需手动解析 JSON
      const data = JSON.parse(xhr.responseText);
      console.log(data);
    } else {
      // 失败
      console.error('Error:', xhr.status);
    }
  }
};

// 发送数据需手动序列化
xhr.send(JSON.stringify({ name: 'Jack' }));

```

#### 2. Fetch API - “现代原生”

使用了 Promise，但有一个**著名的“两步走”陷阱**：`fetch` 只需要网络通了就会 resolve，哪怕是 404 或 500 错误。

```javascript
fetch('/api/user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'Jack' }) // 仍需手动序列化
})
.then(response => {
  // 第一步：检查 HTTP 状态码
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  // 第二步：解析 Body 流
  return response.json(); 
})
.then(data => {
  console.log(data);
})
.catch(error => {
  // 只有网络断了才会进这里
  console.error('Fetch error:', error);
});

```

#### 3. Axios - “工程化利器”

封装了所有脏活累活，专注于业务逻辑。

```javascript
axios.post('/api/user', { name: 'Jack' }) // 自动序列化
  .then(response => {
    // 自动判断状态码，自动解析 JSON
    console.log(response.data); 
  })
  .catch(error => {
    // 404, 500 等错误自动进这里
    console.error('Axios error:', error);
  });

```


## 为什么大家在项目中更爱用 Axios？

虽然 `fetch` 是原生的，但在大型商业项目中，`axios` 依然是霸主，主要因为以下痛点：

#### A. 拦截器 (Interceptors) —— Axios 的杀手锏

在企业级开发中，我们需要给**每一个**请求都带上 Token，或者在**每一个**响应报错时（比如 Token 过期）统一跳转登录页。

* **Fetch:** 你需要写一个 wrapper 函数包裹 fetch，并在每个页面都引用这个 wrapper。
* **Axios:** 全局配置一次即可。

```javascript
// Axios 拦截器示例
axios.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
  return config;
});

```

#### B. 错误处理机制

* **Fetch:** 极其“诚实”。服务器返回 `404 Not Found`，fetch 认为“我成功联系到了服务器，服务器告诉我没找到”，所以 Promise 是 **Resolved** 的。开发者经常忘记判断 `response.ok` 导致代码报错。
* **Axios:** 更符合直觉。只要状态码不是 2xx，直接 **Reject**，抛出错误。

#### C. 超时设置 (Timeout)

* **XHR / Axios:** 直接配置 `timeout: 5000`。
* **Fetch:** 原生不支持超时。必须配合 `AbortController` 和 `setTimeout` 自己写竞态逻辑（虽然现在大部分封装库都做好了，但原生依然没有直接参数）。

---

### 4. 什么时候该用哪个？

1. **首选 Axios：**
* 绝大多数 **Vue / React 企业级项目**。
* 需要统一管理请求拦截（Token注入、全局Loading条）。
* 需要兼容低版本浏览器（Axios 兼容性极好）。
* 需要 Node.js 中间层转发请求（Axios 在 Node 端自动切换为 http 模块）。


2. **首选 Fetch：**
* **流式处理 (Streaming):** 如 ChatGPT 式的 AI 对话（如前文所述，fetch处理流最自然）。
* **极简项目 / Demo:** 不想安装几 KB 的依赖，想直接写代码。
* **Service Worker:** 在 Service Worker 环境中只能用 fetch，无法访问 XHR。
* **Next.js / Remix:** 现代框架对 fetch 进行了魔改（增加了缓存机制），推荐使用框架自带的 fetch。


3. **XHR：**
* **不要用。** 除非你在维护 10 年前的老代码，或者你需要极度精细的 `onprogress` 监控且无法使用 Axios。

## fetch处理流式响应

### 代码实现示例

这是一个通用的处理流式文本（例如 AI 对话流）的代码范例：

```javascript
async function fetchStream() {
  const url = 'https://api.example.com/stream-endpoint'; // 你的流式接口地址

  try {
    const response = await fetch(url);

    // 1. 检查响应是否成功
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 2. 获取 ReadableStream 的读取器
    const reader = response.body.getReader();
    
    // 3. 创建解码器 (用于将二进制数据转为文本)
    const decoder = new TextDecoder('utf-8');

    console.log("开始接收流数据...");

    // 4. 循环读取数据
    while (true) {
      // read() 返回一个 Promise，解析为 { done, value }
      const { done, value } = await reader.read();

      // 如果 done 为 true，说明流已结束
      if (done) {
        console.log("流传输结束");
        break;
      }

      // 5. 解码当前块 (chunk)
      // value 是 Uint8Array，需要转成字符串
      // { stream: true } 选项保持流的内部状态，防止多字节字符被截断
      const chunk = decoder.decode(value, { stream: true });

      // 6. 在这里处理你的业务逻辑 (比如更新 UI，追加文字)
      console.log('接收到片段:', chunk);
      // document.getElementById('output').innerText += chunk; 
    }

  } catch (error) {
    console.error('流处理出错:', error);
  }
}

fetchStream();

```

---

### 关键细节解析

#### 1. `response.body`

普通的 `fetch` 用法通常是 `await response.json()`。这实际上是让浏览器帮你把流读完并解析成对象。而在流式处理中，我们直接操作底层的 `body`。

#### 2. `TextDecoder`

网络传输的是二进制数据（`Uint8Array`）。

* 如果你直接打印 `value`，你会看到类似 `[72, 101, 108, 108, 111]` 的数组。
* `TextDecoder` 负责把这些数字翻译成人类可读的字符串。
* **注意**：`{ stream: true }` 很重要。如果一个中文字符（通常占3个字节）正好被切分在两个 Chunk 之间（前一个 Chunk 有前2个字节，后一个 Chunk 有第3个字节），`stream: true` 会告诉解码器缓存这2个字节，等下一个 Chunk 来了再拼成完整的字，避免出现乱码。

#### 3. 如何中断流？ (AbortController)

流式响应通常持续时间较长，用户可能会中途取消。你需要使用 `AbortController`。

```javascript
const controller = new AbortController();
const signal = controller.signal;

// 绑定 signal
fetch(url, { signal }).then(...);

// 在某个按钮点击事件中取消
// stopButton.onclick = () => controller.abort();

```

当调用 `controller.abort()` 时，`reader.read()` 会抛出一个错误，你需要用 `try...catch` 捕获这个错误（通常名为 `AbortError`）。

---

### fetch实际应用场景

1. **AI 对话 (ChatGPT 模式):** 服务端每生成一个字就推送到前端，前端接收到一个 chunk 就拼接到页面上，产生“打字机”效果。
2. **大文件处理:** 例如处理一个 100MB 的 CSV 文件，不需要等全部下载完，可以下载 1MB 就解析 1MB，节省内存。
3. **视频/音频缓冲:** 逐步加载媒体数据。
