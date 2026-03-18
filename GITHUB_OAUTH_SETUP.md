# GitHub OAuth 配置指南

## ⚠️ 重要：回调 URL 必须完全匹配！

## 步骤 1：创建 GitHub OAuth 应用

1. 访问 [GitHub 开发者设置](https://github.com/settings/developers)
2. 点击 "OAuth Apps" → "New OAuth App"
3. **精确填写以下信息**：
   - **Application name**: `My Portfolio`
   - **Homepage URL**: `https://my-portfolio-jade-delta-jzu90f5wpd.vercel.app/`
   - **Application description**: 我的个人作品集
   - **Authorization callback URL**: `https://my-portfolio-jade-delta-jzu90f5wpd.vercel.app/`

   ⚠️ **注意**：回调 URL 必须完全一致，包括最后的斜杠 `/`

4. 点击 "Register application"

## 步骤 2：获取凭证

创建应用后，你会看到：
- **Client ID**: 复制这个值
- 点击 "Generate a new client secret" 生成 Client Secret，复制这个值（只显示一次，请妥善保存）

## 步骤 3：配置环境变量

### 本地开发 (.env 文件)

在项目根目录的 `.env` 文件中添加：

```env
VITE_GITHUB_CLIENT_ID=你的ClientID
VITE_GITHUB_CLIENT_SECRET=你的ClientSecret
VITE_GITHUB_REDIRECT_URI=https://my-portfolio-jade-delta-jzu90f5wpd.vercel.app/
```

### Vercel 生产环境

1. 访问 [Vercel 项目设置](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 "Settings" → "Environment Variables"
4. **添加以下3个环境变量**：

   | 变量名 | 值 |
   |--------|-----|
   | `VITE_GITHUB_CLIENT_ID` | 你的 Client ID |
   | `VITE_GITHUB_CLIENT_SECRET` | 你的 Client Secret |
   | `VITE_GITHUB_REDIRECT_URI` | `https://my-portfolio-jade-delta-jzu90f5wpd.vercel.app/` |

   ⚠️ **重要**：所有值都必须与 GitHub OAuth 应用中配置的完全一致！

5. 点击 "Save" 保存

## 步骤 4：重新部署

配置完成后，重新部署你的项目：

```bash
git add .
git commit -m "添加 GitHub OAuth 配置"
git push
```

Vercel 会自动重新部署。

## 功能说明

配置完成后，用户可以：
1. 点击 "用 GitHub 登录" 按钮
2. 授权访问 GitHub 账号
3. 登录后可以发布留言
4. 上传图片或视频到留言
5. 删除自己发布的留言

所有留言数据都会保存在 Vercel KV 数据库中。
