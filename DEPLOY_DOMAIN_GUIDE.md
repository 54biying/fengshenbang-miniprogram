# 疯神榜小程序上线 - 域名配置指南

## 🎯 目标：今天完成小程序上线

## 第一步：购买域名（5分钟）

### 推荐域名后缀选择
1. `.com` - 最通用，用户信任度高（¥55-70/年）
2. `.cn` - 国内常用（¥35-45/年）
3. `.app` - 适合应用类（¥80-100/年）

### 可用域名推荐（需检查是否可注册）
- `fspingtai.com` - 疯神平台
- `xuexibang.com` - 学习帮
- `zhiyoubang.cn` - 智友帮
- `wolaixuexi.com` - 我来学习
- `yiqixuexi.app` - 一起学习

### 购买平台
- **阿里云**: https://wanwang.aliyun.com
- **腾讯云**: https://dnspod.cloud.tencent.com
- **华为云**: https://www.huaweicloud.com/product/dns.html

### 购买步骤
1. 登录平台，搜索想买的域名
2. 检查是否可注册
3. 加入购物车，支付购买
4. 完成实名认证（个人身份证）

---

## 第二步：DNS解析（5分钟）

购买域名后，添加A记录：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| A | @ | 101.34.64.175 |
| A | www | 101.34.64.175 |
| A | api | 101.34.64.175 |

**说明**:
- `@` 表示主域名（如 fspingtai.com）
- `www` 表示 www.fspingtai.com
- `api` 表示 api.fspingtai.com（建议用这个）

---

## 第三步：配置SSL证书（10分钟）

### 方式A：使用Nginx + Let's Encrypt（推荐）

在服务器上执行：

```bash
# 安装 certbot
apt update
apt install -y certbot python3-certbot-nginx

# 申请证书（替换为你的域名）
certbot --nginx -d fspingtai.com -d www.fspingtai.com

# 按照提示完成验证
# 证书会自动配置到Nginx
```

### 方式B：手动配置

1. 在腾讯云/阿里云申请免费SSL证书
2. 下载Nginx格式的证书
3. 上传到服务器 `/etc/nginx/ssl/`
4. 配置Nginx

---

## 第四步：配置Nginx（10分钟）

编辑Nginx配置文件：

```bash
nano /etc/nginx/sites-available/default
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name fspingtai.com www.fspingtai.com;
    
    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name fspingtai.com www.fspingtai.com;

    # SSL证书配置（certbot会自动配置）
    ssl_certificate /etc/letsencrypt/live/fspingtai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fspingtai.com/privkey.pem;

    # 反向代理到Next.js应用
    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

测试并重载Nginx：
```bash
nginx -t
systemctl reload nginx
```

---

## 第五步：小程序后台配置（5分钟）

1. 登录微信公众平台
2. 开发 → 开发管理 → 开发设置
3. 服务器域名配置：
   - **request合法域名**: `https://fspingtai.com`
   - **uploadFile**: `https://fspingtai.com`
   - **downloadFile**: `https://fspingtai.com`
4. 扫码确认

---

## 第六步：修改小程序代码（2分钟）

编辑 `app.js`：

```javascript
globalData: {
  userInfo: null,
  token: null,
  baseUrl: 'https://fspingtai.com/api'  // 修改为你的域名
}
```

---

## 第七步：上传并提交审核（10分钟）

1. 微信开发者工具 → 上传
2. 填写版本号（如 1.0.0）和项目备注
3. 小程序后台 → 版本管理 → 提交审核
4. 填写功能介绍和测试账号
5. 等待审核（通常1-3个工作日）

---

## ⏰ 时间预估

| 步骤 | 时间 |
|-----|------|
| 购买域名 | 5分钟 |
| DNS解析 | 5分钟（生效需10-30分钟）|
| SSL证书 | 10分钟 |
| Nginx配置 | 10分钟 |
| 小程序配置 | 5分钟 |
| 修改代码并上传 | 5分钟 |
| **总计** | **约40-60分钟** |

---

## ⚠️ 注意事项

1. **域名实名认证**: 购买后必须完成实名认证才能使用
2. **DNS生效时间**: 一般10-30分钟，最长48小时
3. **SSL证书**: Let's Encrypt证书90天有效期，会自动续期
4. **备案**: 个人小程序暂不强制要求备案，但建议后续补办

---

## 🚀 快速检查清单

- [ ] 域名已购买并实名认证
- [ ] DNS解析已配置并生效
- [ ] SSL证书已配置
- [ ] Nginx配置正确并能访问
- [ ] 小程序后台已添加域名
- [ ] 小程序代码baseUrl已修改
- [ ] 代码已上传
- [ ] 已提交审核

---

*创建时间: 2026-04-08*
*目标: 今天完成小程序上线*
