
## JWT（JSON Web Token）和 Session 的区别？
JWT（JSON Web Token）和 Session 是目前 Web 开发中最主流的两种用户认证方案。简单来说，Session 是“有状态”的（数据存在服务器），而 JWT 是“无状态”的（数据存在客户端）。


### 1. 核心区别：一张表看懂

| 特性 | Session 登录方案 | JWT 登录方案 |
| :--- | :--- | :--- |
| 存储位置 | 服务器端（内存/Redis/数据库），客户端只存一个 ID（Cookie） | 客户端（LocalStorage/Cookie），数据本身就在 Token 里 |
| 状态管理 | 有状态：服务器记住了你是谁 | 无状态：服务器不记人，只验证你带的“介绍信”真伪 |
| 扩展性 | 较差（集群需配置 Redis 共享 Session） | 极好（天生适合分布式/微服务，不用共享数据） |
| 安全性 | 较高（敏感数据在服务器，客户端拿不到） | 中等（数据在客户端，需防 XSS/窃取，不能存密码） |
| 注销/踢人 | 容易（服务器删掉 Session 数据即可） | 困难（发出去的 Token 就收不回了，需等过期） |


### 2. 原理解析

🛡️ Session：服务器端的“存包柜”
1.  登录：你输入账号密码，服务器验证通过后，在服务器内存或 Redis 里创建一个“柜子”（Session），里面放着你的用户信息。
2.  发钥匙：服务器只把柜子的编号（Session ID）通过 Cookie 发给你。
3.  访问：你下次请求时，浏览器自动带上这个编号。服务器根据编号去查柜子，确认你是谁。

*   优点：数据在服务器手里，非常安全；想让谁下线（踢人）直接删柜子就行。
*   缺点：在微服务架构下，如果服务器 A 认识你，服务器 B 不认识你，就需要搭建 Redis 集群来同步所有柜子信息，增加了复杂度。

🔑 JWT：客户端的“身份证”
1.  登录：你登录成功后，服务器把你的一些关键信息（如用户 ID、角色）打包，加上签名（防伪章），生成一个长字符串（Token）发给你。
2.  存证：你把这个 Token 存在浏览器里（通常是 LocalStorage）。
3.  访问：你每次请求都把 Token 放在请求头（Header）里发给服务器。服务器不用查数据库，只需要验算那个“防伪章”是否有效，以及看看里面的信息是否过期。

*   优点：服务器完全不用存状态，横向扩展能力极强（加机器就行，不用同步数据）；非常适合前后端分离和 App 开发。
*   缺点：Token 一旦发出去，在过期时间之前服务器很难收回（比如你想强制下线，很难做到）。

特别提醒：使用 JWT 时，千万不要在 Payload（数据体）里存放密码、手机号等敏感信息，因为这部分数据只是做了 Base64 编码，是可以被轻易解码看到的。

## 认证信息存Cookie还是LocalStorage
结论是：为了安全，首选 HttpOnly Cookie；为了方便和跨域，才选 LocalStorage。这就像是在“防小偷（XSS）”和“防被利用（CSRF）”之间做权衡。

### 首选 HttpOnly Cookie

在 2026 年的当前技术环境下，将 Token 存在带有 HttpOnly 属性的 Cookie 中是更安全的主流方案。

*   为什么？ 因为 HttpOnly 属性能让 JavaScript 无法读取这个 Cookie。即使你的网站不幸中招，被注入了恶意脚本（XSS 攻击），黑客也拿不到你的 Token，这就堵住了最大的安全漏洞。
*   代价是什么？ 你需要防范 CSRF（跨站请求伪造）攻击。不过现代浏览器的 SameSite 属性（设为 Strict 或 Lax）已经能解决大部分 CSRF 问题。

### 详细说说：为什么推荐 Cookie？

1. LocalStorage 的致命伤：XSS
如果你把 Token 放在 LocalStorage 里，只要页面存在任何一个 XSS 漏洞（比如你用了不安全的第三方库，或者用户输入没过滤干净），黑客的一行代码就能把你的 Token 偷走。
代码示例（黑客视角）：
// 如果 Token 在 LocalStorage，黑客只需这段代码就能窃取
fetch('/steal?token=' + localStorage.getItem('token'));
这种情况下，用户的账号就会被盗用，且很难防御。

2. Cookie 的防御战：HttpOnly + SameSite
使用 Cookie 方案，你可以设置两个关键属性来加固：
*   HttpOnly：禁止 JavaScript 访问。这就免疫了上面的 XSS 窃取。
*   SameSite=Strict/Lax：防止跨站请求携带 Cookie。这就防御了 CSRF 攻击（黑客让你在别的网站发请求，浏览器不会带上这个 Cookie）。

### 最佳实践：混合模式

如果你既想要安全，又想要灵活，可以采用“混合模式”，这是很多大厂的高级做法：

1.  Access Token（短期的，15-30分钟过期）：放在 HttpOnly Cookie 里。用于每次请求的身份验证。
2.  Refresh Token（长期的，7天或更久）：存放在 Redis（服务端） 或者另一个 Secure Cookie 里。用于 Access Token 过期后自动刷新。
3.  前端内存：如果需要在前端显示用户名等信息，不要直接解析 Token（不安全），而是单独存一份非敏感的用户信息在内存里，或者通过接口获取。


## 双token方案是如何工作的？

### 双 Token 方案可以分为三个阶段：

1. 登录阶段
用户输入账号密码登录。
*   服务器验证通过后，生成一对 Token（Access + Refresh）。
*   Access Token 返回给前端（放在 Body 或内存中）。
*   Refresh Token 通常通过 Set-Cookie 写入浏览器的 HttpOnly Cookie 中（最安全），或者也返回给前端但要求存入更安全的存储。
*  注意：服务器通常会将 Refresh Token 的 Hash 值存入数据库或 Redis，用于后续验证。

2. 正常访问阶段
用户使用 Access Token 请求接口。
*   请求头携带 Authorization: Bearer 。
*   服务器验证 Access Token 有效，返回数据。

3. 刷新阶段（无感刷新）
当 Access Token 过期时（服务器返回 401 Unauthorized）。
*   前端拦截：前端的 Axios 拦截器捕获到 401 错误，且发现不是登录接口，便暂停所有请求。
*   静默刷新：前端携带 Refresh Token（通常自动随 Cookie 发送，或从安全存储取出）请求 /refresh 接口。
*   服务器验证：服务器检查 Refresh Token 是否有效、是否在黑名单中、是否与数据库记录匹配。
*   发新换旧：验证通过，服务器生成新的 Access Token（有时连 Refresh Token 也一起更新），返回给前端。
*   重试请求：前端拿到新 Token 后，修改失败请求的 Header，重新发送，并恢复其他挂起的请求。
*   结果：用户完全无感，刚才那个报错的页面瞬间刷新出了数据，仿佛什么都没发生。

### 什么是“Refresh Token 轮换（Rotation）”？
为了更安全，很多系统采用“用完即废”策略。即每次刷新后，旧的 Refresh Token 作废，服务器发一个新的回来。如果黑客截获了旧的 Refresh Token 去使用，服务器发现它已经被用过或不存在了，就会判定为风险，强制用户重新登录。

### 双 Token 的优缺点

优点
*   安全性高：核心的 Refresh Token 很难被窃取（HttpOnly + 短期 Access Token 降低风险窗口）。
*   体验好：实现了“无感刷新”，用户长时间不用重新登录。
*   可控性强：服务器可以通过控制 Refresh Token 的有效性来强制用户下线（单点登录、踢人功能）。

缺点
*   复杂度高：前端需要写复杂的拦截器逻辑来处理并发请求和刷新流程。
*   增加请求：刷新 Token 时会多一次网络请求（虽然用户无感，但确实增加了服务器压力）。
*   存储成本：服务器需要维护 Refresh Token 的状态（如存 Redis），不再是完全无状态的 JWT，但这是为了安全必须付出的代价。
