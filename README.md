<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 班級小助手 - 抽籤與分組工具

專為老師設計的班級管理工具，提供轉盤抽籤、自動分組、名單管理等功能，支援 CSV 匯入與重複姓名檢查。

## 技術棧

- **框架：** React 19 + TypeScript
- **建置工具：** Vite 6
- **樣式：** Tailwind CSS 4
- **動畫：** Motion (Framer Motion)
- **部署：** GitHub Pages (GitHub Actions 自動部署)

## 功能

- **名單管理** - 新增、編輯、刪除學生，支援 CSV 匯入
- **轉盤抽籤** - 動畫轉盤隨機抽選，可設定是否允許重複
- **自動分組** - 將名單隨機分配到不同小組

## 本地開發

**需求：** Node.js >= 18

```bash
# 安裝依賴
npm install

# 啟動開發伺服器 (http://localhost:3000)
npm run dev

# 型別檢查
npm run lint

# 正式建置
npm run build

# 預覽建置結果
npm run preview
```

如需使用 Gemini API，請複製 `.env.example` 為 `.env.local` 並填入 API Key：

```bash
cp .env.example .env.local
```

## 部署

本專案使用 GitHub Actions 自動部署到 GitHub Pages。

1. 將程式碼推送到 `main` 分支
2. 前往 GitHub 倉庫 **Settings > Pages**
3. 將 **Source** 設為 **GitHub Actions**
4. 推送到 `main` 後會自動觸發部署

部署設定檔：[.github/workflows/deploy.yml](.github/workflows/deploy.yml)

> 如果部署到子路徑（如 `https://<username>.github.io/<repo>/`），請確認 `vite.config.ts` 中的 `base` 設定正確。

## 專案結構

```
├── src/
│   ├── components/       # React 元件
│   │   ├── GroupingTool.tsx
│   │   ├── NameListManager.tsx
│   │   └── Wheel.tsx
│   ├── lib/
│   │   └── utils.ts      # 工具函式
│   ├── App.tsx            # 主應用元件
│   ├── index.css          # 全域樣式
│   ├── main.tsx           # 入口點
│   └── types.ts           # TypeScript 型別定義
├── .github/workflows/     # CI/CD 設定
├── index.html             # HTML 入口
├── vite.config.ts         # Vite 設定
├── tsconfig.json          # TypeScript 設定
└── package.json           # 專案依賴
```
