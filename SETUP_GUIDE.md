# 项目部署和配置指南

## 📋 重要说明

### 🔴 关于后台无法访问的问题

**解决方案：**

1. **立即配置 Vercel 环境变量**
   - 登录 Vercel 控制面板
   - 进入你的项目 → **Settings** → **Environment Variables**
   - 添加以下环境变量：
     ```
     VITE_ADMIN_PASSWORD=admin123
     VITE_CLOUDINARY_CLOUD_NAME=你的cloud_name
     VITE_CLOUDINARY_UPLOAD_PRESET=你的upload_preset
     ```

2. **重新部署**
   - 添加完环境变量后，在 Vercel 控制面板点击 **Deployments** → 最新的部署 → **Redeploy**
   - 或者推送新代码到 GitHub 触发自动部署

3. **正确的访问地址**
   - 主站：https://my-portfolio-jade-delta-jzu90f5wpd.vercel.app/
   - 后台：https://my-portfolio-jade-delta-jzu90f5wpd.vercel.app/admin

---

## 💾 关于数据存储方案

### 当前问题
- 使用 localStorage 存储，数据只在本地浏览器有效
- 其他用户看不到你上传的内容
- 换设备数据会丢失

### 推荐方案：Vercel KV（最简单）

**Vercel KV 优点：**
- ✅ 完全免费
- ✅ 配置简单，5分钟搞定
- ✅ 速度快
- ✅ 数据永久保存
- ✅ 所有用户可以共享数据

**设置步骤：**

1. 在 Vercel 项目中启用 KV
   - 进入项目 → **Storage** → **Create Database**
   - 选择 **KV** → 命名为 `portfolio-db`
   - 选择区域（推荐香港或东京）
   - 点击 **Create**

2. 连接到你的项目
   - 创建后点击 **Connect** → 选择你的项目
   - 点击 **Connect Project**

3. 自动添加环境变量
   - Vercel 会自动添加 `KV_URL`、`KV_REST_API_URL` 等环境变量

4. 重新部署

---

## 📱 后台访问

**密码：** `admin123`（或你在 Vercel 环境变量中设置的密码）

**访问地址：** `/admin`

---

## 🎯 快速检查清单

- [ ] Vercel 环境变量已配置
- [ ] 已重新部署
- [ ] 访问 `/admin` 而不是其他路径
- [ ] 使用正确的管理员密码

如果还有问题，请告诉我具体的错误信息！
