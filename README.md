# 小决定

一个帮你做选择的网页应用。

## 功能

- 转盘抽选（支持自定义权重）
- 随机数生成器
- 抛硬币
- 多人手指轮盘

## 技术栈

- React + TypeScript
- Vite
- Tailwind CSS
- 数据存储在 localStorage

## 本地运行

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 构建

```bash
npm run build
```

构建产物在 `dist/` 目录。

## 部署

推荐使用 Cloudflare Pages：

1. 推送代码到 GitHub
2. 在 Cloudflare Pages 连接仓库
3. 构建命令：`npm run build`
4. 输出目录：`dist`

## 说明

所有数据保存在浏览器本地，不会上传到服务器。清除浏览器数据会导致数据丢失。

## License

MIT
