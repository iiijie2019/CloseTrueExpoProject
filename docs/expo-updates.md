# Word Grove · EAS Update

项目使用 Expo SDK 57 和 `expo-updates`，关联现有 EAS 项目 `@yangwujie/CloseTrueExpoProject`。项目 ID 为 `2b58a1d1-5f17-410a-8463-491767037f3e`；更新地址直接对应这个项目。

## 当前行为

- `runtimeVersion.policy = fingerprint`：构建和发布时由原生依赖、配置等计算兼容性。只有平台、runtime 和通道匹配的安装包会收到更新。
- 启动时检查并下载更新，`fallbackToCacheTimeout = 0`，不等待网络阻塞启动。后台下载完成后通常在下次冷启动应用。
- “我的 → 应用更新”提供手动检查；下载完成后显示“重新打开并应用”。不会因为下载完成而突然重启正在使用的页面。
- 点击应用更新时先等待本地保存队列完成；保存失败会取消重启。标记仍使用原来的 SQLite 数据库和键。
- 网络失败可重试，学习内容和已保存的标记仍可离线使用。服务端回退到安装包内置版本的指令也会被处理。
- Web、Expo Go、普通开发模式不显示不可用的 OTA 操作。网页通过重新打开页面获取部署后的版本。

## 第一次验证

这次新增了原生依赖 `expo-updates`，**必须先重新构建并安装一个安装包**。仅向旧包发布 JS 更新无法给它安装原生更新模块。

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
eas whoami
eas project:info

# Android 内部分发安装包，适合先验证 OTA。
eas build --platform android --profile preview

# iOS 需要配置自己的 bundleIdentifier、签名和内部分发设备。
eas build --platform ios --profile preview
```

`app.json` 保留了现有 Android package；尚未替用户填写 iOS bundleIdentifier 或创建签名凭据。预览构建的 iOS 分发方式还需按实际账号和设备设置。

## 发布更新

安装 preview 包后，修改一句可观察的界面文字，再发布至同名通道。SDK 57 发布更新需指定 environment，避免构建与更新使用不同环境变量。

```bash
eas update --channel preview --environment preview --message "Verify Word Grove update"
```

打开预览安装包，在“我的”中检查、下载并应用更新，验证文字变化，以及语言偏好、单词标记仍然保留。再断网重新打开，确认缓存内容仍可用。

正式包与正式更新使用同一 production 通道：

当前 `eas.json` 中 Android 的 production 已选择 APK／internal 分发，因此下面的 Android 命令产出内部安装包，并不直接提交 Google Play。未来上架时可另设 AAB／store 的构建配置；通道仍可使用 production。

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
eas update --channel production --environment production --message "Describe the release"
```

这些是后续发布命令，本次实现没有执行云端构建、发布 OTA 或提交商店。EAS Build 的 `--profile` 选择构建配置；`eas.json` 中的 `channel` 才决定安装包接收哪个更新通道。不要把 branch 和 channel 当成必然同名的同一概念。

## 更新范围与回退

兼容 runtime 内的 JS、样式、词库和打包资源可以通过 OTA 更新。添加原生库、改变权限、原生插件配置、图标或启动屏配置等，需要重新构建安装包。fingerprint 变化时先构建对应的新包，不要改写 runtime 强行兼容。

保留可回退的历史更新。需要回退时，在 EAS 项目中核对受影响的平台、通道、runtime 和更新组，再运行交互式命令：

```bash
eas update:rollback
```

目前 EAS CLI 的 `eas update` **没有 `--force` 参数**，不能用它让用户设备立即重启。应用更新的时机由客户端控制。

## 本地原生构建

本项目的 `ios/` 和 `android/` 为忽略的生成目录，EAS Build 可通过 CNG 生成它们。普通 JS 改动无需 `prebuild`。若本地已生成原生目录，需要将插件和原生配置同步到本地构建时，可运行 `pnpm exec expo prebuild` 并审阅改动；这个命令也不能保证保留所有手工原生修改。`--clean` 会重新生成目录。

```bash
eas build --platform android --profile preview --local
eas build --platform ios --profile production --local
```

本地构建需要对应 Android/iOS 工具链。`development` 配置保留供开发客户端使用；创建开发客户端前需用 `pnpm exec expo install expo-dev-client` 安装其依赖。验证正式 OTA 行为优先用 preview release 包。

依据：[SDK 57 Updates](https://docs.expo.dev/versions/v57.0.0/sdk/updates/)、[EAS Update 设置](https://docs.expo.dev/eas-update/getting-started/)、[回退流程](https://docs.expo.dev/eas-update/rollbacks/)。
