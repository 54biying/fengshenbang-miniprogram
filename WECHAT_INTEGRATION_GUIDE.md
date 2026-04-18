# 微信小程序接入指南

## 📋 接入状态

| 项目 | 状态 | 说明 |
|------|------|------|
| AppID | ✅ 已配置 | wx55e15886b3dfd03c |
| 项目配置 | ✅ 已更新 | project.config.json |
| API 域名 | ⚠️ 需要配置 | https://101.34.64.175 (需要HTTPS) |
| 服务器代理 | ✅ 已完成 | Nginx /api → 9000 |
| SSL 证书 | ❌ 需要配置 | 微信必须HTTPS |
| 域名白名单 | ⏳ 待配置 | 微信公众平台设置 |

---

## 🚀 已完成配置

### 1. 项目配置更新
```json
// project.config.json
{
  "appid": "wx55e15886b3dfd03c",
  "projectname": "fengshenbang-miniprogram"
}
```

### 2. API 配置
```javascript
// app.js
globalData: {
  baseUrl: 'https://101.34.64.175/api'
}
```

### 3. Nginx 代理配置
```
/api/* → http://127.0.0.1:9000/api/*
/*    → http://127.0.0.1:3000
```

---

## ⚠️ 待完成配置

### 1. 配置 HTTPS (必须)

微信小程序**必须**使用 HTTPS API，需要：

#### 方案一：Let's Encrypt 免费证书（推荐）
```bash
# 安装 certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 申请证书（需要域名）
sudo certbot --nginx -d yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

#### 方案二：使用 IP + 临时证书测试
```bash
# 生成自签名证书（仅供测试）
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes

# 配置 Nginx HTTPS
sudo cat > /etc/nginx/sites-available/fengshenbang-ssl << 'EOF'
server {
    listen 443 ssl;
    server_name _;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # API 请求
    location /api/ {
        proxy_pass http://127.0.0.1:9000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 其他请求
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/fengshenbang-ssl /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

### 2. 微信公众平台配置

登录 [微信公众平台](https://mp.weixin.qq.com)：

#### 2.1 设置服务器域名
```
登录 → 开发 → 开发管理 → 服务器域名 → 添加域名

request 合法域名: https://101.34.64.175
wsconnect 合法域名: wss://101.34.64.175 (如需要WebSocket)
```

#### 2.2 获取 AppSecret
```
登录 → 开发 → 开发管理 → 开发设置 → 获取 AppSecret
⚠️ AppSecret 非常重要，请妥善保管！
```

#### 2.3 配置小程序信息
- 小程序名称：疯神榜
- 小程序描述：社交+AI辅助学习平台
- 类目：教育 - 在线教育

---

### 3. 更新后端配置

将获取的 AppID 和 AppSecret 配置到后端环境变量：

```bash
# 在服务器上执行
export WECHAT_APP_ID="wx55e15886b3dfd03c"
export WECHAT_APP_SECRET="your_app_secret_here"

# 重启后端服务
pm2 restart all
# 或
sudo systemctl restart fengshenbang
```

---

## 📱 开发版测试

配置完成后，可以在微信开发者工具中：

1. 导入项目：`/workspace/projects/fengshenbang-miniprogram`
2. AppID：`wx55e15886b3dfd03c`
3. 勾选"不校验合法域名"（开发阶段）
4. 点击"编译"进行测试

---

## 🚢 发布审核

1. 完成开发并自测
2. 填写版本信息
3. 提交审核
4. 等待审核（通常 1-7 天）
5. 审核通过后发布

---

## ❓ 常见问题

### Q: 提示"域名不在合法域名列表中"
A: 确保在微信公众平台正确配置了 request 合法域名

### Q: 提示"无效的签名"
A: 检查 AppSecret 是否正确，或重新生成

### Q: HTTPS 证书错误
A: 确保使用有效的 SSL 证书，自签名证书仅供开发测试

---

*文档创建时间：2026-04-07*
*最后更新：2026-04-07*
