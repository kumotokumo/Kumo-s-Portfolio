# CloudBase 静态网站托管部署指南

## 前置条件

1. 已安装 CloudBase CLI（已安装为项目依赖）
2. 已开通腾讯云 CloudBase 静态网站托管服务
3. 环境 ID: `kumo-s-portfolio-1f7f16g4b4797a6`
4. 默认域名: `kumo-s-portfolio-1f7f16g4b4797a6-1305521879.tcloudbaseapp.com`

## 首次部署步骤

### 1. 登录 CloudBase

```bash
npx tcb login
```

按照提示在浏览器中完成登录授权。

### 2. 初始化环境（如果需要）

```bash
npx tcb env:list
```

如果环境不存在，需要先在腾讯云控制台创建环境。

### 3. 构建项目

```bash
npm run build
```

构建产物会输出到 `dist/` 目录。

### 4. 部署到 CloudBase

**方式一：使用部署脚本（推荐）**

```bash
npm run deploy:cloudbase
```

**方式二：手动部署**

```bash
npx tcb hosting deploy dist -e kumo-s-portfolio-1f7f16g4b4797a6
```

## 配置文件说明

- `cloudbase.json`: CloudBase 配置文件，指定了环境 ID 和构建输出目录
- `.tcbignore`: 部署时忽略的文件和目录，避免上传不必要的文件

## 注意事项

1. **Base 路径**: 项目已配置为使用根路径 `/`，适合 CloudBase 部署
2. **图片资源**: 项目使用腾讯云 COS 存储图片，确保 COS 配置正确
3. **环境变量**: 如需使用环境变量，请在 CloudBase 控制台配置

## 后续更新

每次更新后，只需运行：

```bash
npm run deploy:cloudbase
```

即可自动构建并部署最新版本。

## 查看部署状态

```bash
npx tcb hosting:list -e kumo-s-portfolio-1f7f16g4b4797a6
```

## 访问网站

部署成功后，可通过以下地址访问：

- 默认域名: https://kumo-s-portfolio-1f7f16g4b4797a6-1305521879.tcloudbaseapp.com
- 自定义域名: 在 CloudBase 控制台配置自定义域名后可使用

