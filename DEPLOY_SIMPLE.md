# CloudBase 部署简单指南

## 问题说明

**不需要全局安装 CloudBase CLI**，项目已经包含了 CLI 工具，使用 `npx tcb` 即可。

## 快速部署步骤

### 1. 确保已登录 CloudBase

```bash
npx tcb login
```

如果已经登录过，可以跳过这一步。

### 2. 部署到 CloudBase

**使用修复后的部署命令（推荐）：**

```bash
npm run deploy:cloudbase
```

这个命令会：
1. 构建项目（使用根路径 `/`）
2. 进入 `dist` 目录
3. 将文件直接部署到 CloudBase 根路径（不是子路径）

### 3. 验证部署

部署后检查文件列表：

```bash
npx tcb hosting:list -e kumo-s-portfolio-1f7f16g4b4797a6 | grep -E "(index.html|assets)"
```

**正确的文件路径应该是：**
- `index.html` ✅（不是 `Kumo-s-Portfolio/index.html`）
- `assets/index-Blfa0Ere.css` ✅（不是 `Kumo-s-Portfolio/assets/...`）
- `assets/index-D_kmy1Nd.js` ✅

### 4. 访问网站

部署成功后访问：
- https://kumo-s-portfolio-1f7f16g4b4797a6-1305521879.tcloudbaseapp.com

## 如果仍然失败

### 清理 CloudBase 上的旧文件

如果文件仍然在 `Kumo-s-Portfolio/` 子路径下：

1. **登录 CloudBase 控制台**
   - 访问：https://console.cloud.tencent.com/tcb
   - 进入：静态网站托管 → 文件管理

2. **删除旧文件**
   - 找到 `Kumo-s-Portfolio/` 目录
   - 删除整个目录（或其中的文件）

3. **重新部署**
   ```bash
   npm run deploy:cloudbase
   ```

## 常见问题

### Q: npm 权限错误怎么办？
A: 不需要全局安装，使用 `npx tcb` 即可。如果一定要全局安装，运行：
```bash
sudo chown -R $(whoami) ~/.npm
npm install -g @cloudbase/cli
```

### Q: 文件仍然在子路径下？
A: 确保使用 `npm run deploy:cloudbase`（不是 `npm run deploy:cloudbase:verify`），这个命令会从 `dist` 目录内部部署。

### Q: 如何确认文件路径？
A: 运行 `npx tcb hosting:list -e kumo-s-portfolio-1f7f16g4b4797a6`，检查文件路径是否以 `Kumo-s-Portfolio/` 开头。如果是，说明部署到了子路径，需要清理后重新部署。

