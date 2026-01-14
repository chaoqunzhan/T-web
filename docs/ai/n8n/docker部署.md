# 本地docker部署n8n
国内网络下，本地docker部署n8n一直拉不到n8n镜像怎么办？
## 先拉镜像到本地
```sh
nohup docker pull ghcr.io/n8n-io/n8n
```
> 如果拉的慢ssh容易断开，那就nohup拉取
```sh
nohup docker pull ghcr.io/n8n-io/n8n > pull.log 2>&1 &
```
## 编辑 docker-compose.yml
```yml
# docker-compose.yml
version: '3.8'

services:
  n8n:
    # 使用官方最新镜像
    image: ghcr.io/n8n-io/n8n:latest
    
    # 指定用户
    user: "0"

    # 容器重启策略：除非手动停止，否则总是重启（保证服务高可用）
    restart: unless-stopped
    
    # 端口映射：将容器的 5678 端口映射到本机的 5678 端口
    # 如果你本机的5678端口被占用了，可以改成 "5679:5678" 等
    ports:
      - "5678:5678"
      
    # 环境变量配置
    environment:
      # --- 核心设置 ---
      # 设置时区为上海 (非常重要，否则时间会差8小时)
      - TZ=Asia/Shanghai
      
      # 设置 Webhook 的 URL (自动获取本机 IP)
      # 如果你绑定了域名，请改为: - N8N_HOST=yourdomain.com
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      
      # --- 数据库设置 (默认使用 SQLite，无需额外配置) ---
      - DB_TYPE=sqlite
      
      # --- 安全设置 (强烈建议开启，保护你的面板不被未授权访问) ---
      # 取消注释下面三行以开启用户名密码登录
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_secure_password_here
      
      # --- 性能与清理 ---
      # 自动清理旧的执行记录，防止数据库过大
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=168  # 168小时 = 7天
      - EXECUTIONS_DATA_PRUNE_MAX_COUNT=10000

    # 数据卷挂载：将容器内的数据目录映射到本机的 ./data 文件夹
    # 这样即使删除容器，你的工作流、凭证(公众号密钥等)也不会丢失
    volumes:
      - ./data:/home/node/.n8n
```

## 启动容器
```sh
docker compose up -d
```

## 查看启动日志
```sh
docker compose logs -f
```

## 本地访问，愉快n8n
```
http://localhost:5678/
```