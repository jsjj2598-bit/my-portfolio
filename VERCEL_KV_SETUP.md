# Vercel KV 配置指南

## 第一步：在 Vercel 上配置 KV

### 1. 创建 KV 数据库
1. 登录 Vercel 控制面板
2. 进入你的项目
3. 点击顶部的 **Storage** 标签
4. 点击 **Create Database**
5. 选择 **KV**（Redis）
6. 数据库名称：`portfolio-db`
7. 选择区域：推荐 **Hong Kong, Hong Kong (hkg1)** 或 **Tokyo, Japan (nrt1)**
8. 点击 **Create**

### 2. 连接 KV 到你的项目
1. KV 创建成功后，点击 **Connect** 按钮
2. 选择你的项目（`my-portfolio`）
3. 点击 **Connect Project**
4. Vercel 会自动添加环境变量：
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 3. 重新部署
1. 点击 **Deployments** 标签
2. 找到最新的部署，点击右侧的 **...**
3. 选择 **Redeploy**
4. 等待部署完成

---

## 第二步：完成后告诉我

完成上面的步骤后，告诉我"KV 配置好了"，我会继续创建 Serverless Functions 和更新代码！
