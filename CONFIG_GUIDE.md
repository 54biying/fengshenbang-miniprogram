# 小程序配置说明

## baseUrl 配置

### 开发环境
- 本地开发：连接到本地后端
  ```javascript
  baseUrl: 'http://localhost:9000/api'
  ```

### 生产环境
- 外网服务器：连接到云服务器后端
  ```javascript
  baseUrl: 'https://101.34.64.175/api'
  ```

## 配置方法

### 方法1：修改 app.js
编辑 `app.js` 文件：
```javascript
globalData: {
  baseUrl: 'https://your-server-ip-or-domain.com/api'
}
```

### 方法2：使用环境变量（推荐）
1. 创建 `config.js` 文件：
```javascript
const config = {
  baseUrl: process.env.API_BASE_URL || 'https://101.34.64.175/api'
}

module.exports = config
```

2. 在 `app.js` 中引用：
```javascript
const config = require('./config.js')

globalData: {
  baseUrl: config.baseUrl
}
```

## 开发模式配置

如果需要在开发模式连接本地后端：

### 1. 在微信开发者工具中
- 点击右上角"详情"
- 勾选"不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书"
- 这样可以使用 `http://localhost:9000/api`

### 2. 真机调试
- 需要外网访问本地后端
- 可以使用内网穿透工具（如 ngrok、frp）

## 生产环境配置步骤

### 1. 购买云服务器
- 推荐配置：
  - CPU: 2核
  - 内存: 4GB
  - 带宽: 5Mbps
  - 系统: Ubuntu 20.04 LTS

### 2. 部署后端服务
```bash
# 连接服务器
ssh root@your-server-ip

# 安装依赖
apt update
apt install -y nodejs npm python3 python3-pip

# 克隆项目
git clone your-repo-url
cd learning-platform

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 生成数据库
npx prisma generate
npx prisma db push

# 启动服务
npm run build
npm start
```

### 3. 配置 HTTPS
```bash
# 安装 Nginx
apt install -y nginx certbot python3-certbot-nginx

# 获取 SSL 证书
certbot --nginx -d your-domain.com

# 配置 Nginx 反向代理
# 编辑 /etc/nginx/sites-available/default
```

### 4. 配置防火墙
```bash
# 允许 HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# 开启防火墙
ufw enable
```

### 5. 更新小程序配置
- 在小程序管理后台配置服务器域名
- 修改小程序代码中的 baseUrl
- 重新上传小程序代码

## 注意事项

1. **域名要求**
   - 必须使用 HTTPS
   - 必须经过 ICP 备案
   - 个人小程序域名限制较少

2. **API 接口**
   - 所有 API 请求必须是 HTTPS
   - WebSocket 也需要 wss:// 协议

3. **本地开发**
   - 开发工具可以关闭域名校验
   - 真机调试需要内网穿透或外网服务器

4. **性能优化**
   - 生产环境建议使用 CDN
   - 图片资源使用云存储（如 COS、OSS）

## 测试步骤

### 开发环境测试
1. 打开微信开发者工具
2. 导入项目
3. 关闭域名校验
4. 测试所有功能

### 生产环境测试
1. 配置服务器域名
2. 上传代码并发布
3. 体验版测试
4. 确认所有功能正常
