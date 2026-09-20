# Word Grove · 词间

基于 Expo SDK 57、React Native 和 Expo Router 的英语学习 App。明亮、舒缓的界面，首页与我的两个底部 Tab，无登录和打卡。

## 当前功能

- 248 个离线词条、32 组词根词缀，中英释义、词性、IPA、例句与常见变化。
- 已掌握／未掌握标签点击切换，支持撤销；首页可换词，词族与详情同步状态。
- 时间、数量、食物、日常物品、人物关系、自然天气六类主题，与关键词、词性、掌握状态组合筛选。列表每批加载 30 条。
- 例句突出当前单词及已收录词形，词根／词缀按实际拼写高亮。书页与嫩芽 Logo 应用于桌面图标、启动页和应用内。
- 12 个句子课程：点按彩色词块查看主语、动词、时间、地点、来源等作用；整句／词块朗读；点选排列、提示与替代语序反馈。
- 独立设置页集中提供中文／英文／跟随系统、英美语音、朗读速度、应用更新和数据迁移。
- 朗读不再提示音色回退；原生输出音量低于 20% 时提示调高音量，最多每分钟一次。
- 原生 SQLite 和 Web localStorage；JSON 导入导出、冲突预览、合并前恢复副本。
- Expo Updates：启动检查、手动检查下载、保存完学习记录后由用户应用更新。

## 运行与检查

使用项目已有的 pnpm 锁文件，Node.js 22.13 或更新版本、pnpm 10（工作区使用 `allowBuilds` 配置）。

```bash
pnpm install --frozen-lockfile
pnpm start
pnpm web
pnpm typecheck
pnpm test
pnpm exec expo install --check
pnpm exec expo export --platform all
```

`expo export` 验证 Web 与 Android/iOS 的 JS/资源打包，不代表原生编译、签名或真机验收。`pnpm lint` 仍是模板命令，项目尚未配置 ESLint。Expo Go 可用于常规页面开发；新增原生能力及热更新需重新安装对应构建。TTS 使用系统提供的英语声音，音标独立来自内置数据；真机需另验语音包、静音状态与发音。

## 目录结构

```text
src/app/                 Expo Router 页面与两个 Tab
  settings.tsx           语言、朗读、更新与导入导出
  words.tsx              单词筛选
  word/[id].tsx          词条详情
  roots.tsx              词根词缀列表
  root/[id].tsx          词族树／列表
  sentences.tsx          句子课程与主题筛选
  sentence/[id].tsx      词块解释与语序练习
src/components/grove/    主题组件、矢量图、读音按钮、更新面板
src/data/                词库、句子内容及 native/web 存储适配
src/domain/              类型、备份校验合并、更新流程
src/state/               状态提交队列、语言、TTS、恢复操作
src/i18n/                界面翻译
src/platform/            native/web 文件迁移与音量读取
src/theme/               颜色、字体与样式
modules/grove-volume/    iOS/Android 只读媒体音量模块
tests/                   数据、备份、搜索、高亮、语序与更新测试
```

业务内容和个人数据分开：扩充静态词库无需清空标记；原生个人记录写入应用私有 SQLite，Web 写入当前站点 localStorage。卸载应用、清理浏览器数据或切换站点不会自动同步记录，请用导出文件迁移。

## 构建和更新

已关联现有 EAS 项目，`eas.json` 配置 development、preview、production。首次接入 updates 后，先构建 preview 安装包：

```bash
eas build --platform android --profile preview
eas update --channel preview --environment preview --message "Describe the change"
```

正式发布、本地构建、iOS 设置、回退命令与验证步骤见 [Expo 热更新说明](docs/expo-updates.md)。更新不会安装新的原生依赖；fingerprint 改变时需要匹配的新安装包。

## 设计与内容

- [完整设计方案及当前实现](docs/english-learning-app-design.md)
- [词库与句子内容维护](docs/vocabulary-content.md)
- [Expo SDK 57 版本文档](https://docs.expo.dev/versions/v57.0.0/)

目前内置的是精选教学内容，尚未接入完整授权词典或任意句子的自动解析服务。词根树表达学习关联；IPA 使用美式宽式转写，英式朗读设置不会改变 IPA。词条详情提供外部词典核查入口。


本次图标与音量模块需重新构建安装包才能应用，不能只发布 OTA 更新。Expo Go、旧安装包及浏览器没有音量读取模块时仍能朗读，不显示未经检测的音量提示。音量检测不读取麦克风、不自动调节音量；20% 是系统音量档位阈值，并非环境声压测量。模块接入使用 [Expo 本地模块](https://docs.expo.dev/modules/get-started/)，音量分别读取 [iOS outputVolume](https://developer.apple.com/documentation/avfaudio/avaudiosession/outputvolume) 和 [Android 媒体音量](https://developer.android.com/reference/android/media/AudioManager#getStreamVolume(int))。

Logo 的可编辑源文件为 `assets/images/word-grove-logo.svg`，PNG 与 iOS 图层由 `scripts/generate-brand-assets.cjs` 使用 sharp 渲染。旧备份中的 `focus` 记录读取时自动迁移为 `unknown`，后续保存与导出只使用两种掌握状态。
