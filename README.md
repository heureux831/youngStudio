# MyStudio - AI Chat App

一个使用React Native Paper重构的现代化AI聊天应用，支持多个AI服务提供商。

## 🎨 UI框架升级

本项目已使用 **React Native Paper** 完全重构，提供了：

- 🎯 Material Design 3 设计语言
- 🎨 现代化的组件和动画
- 🌙 主题系统支持
- 📱 更好的用户体验

## ✨ 特性

- 🤖 多AI供应商支持：DeepSeek、OpenAI、Anthropic、Google
- 💬 实时流式聊天响应
- ⚙️ 直观的设置界面
- 📝 Markdown消息渲染
- 🎯 Material Design组件

## 🚀 重构亮点

### 组件升级
- `ChatHeader` → 使用 `Appbar` 和 `Avatar`
- `MessageInput` → 使用 `TextInput` 和 `FAB`
- `MessageItem` → 使用 `Card` 和 `Surface`
- `SettingsModal` → 使用 `SegmentedButtons` 和 `Switch`
- `TypingIndicator` → 使用 `ActivityIndicator` 和动画

### 主题系统
```javascript
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    secondary: '#1976D2',
    surface: '#ffffff',
    background: '#f5f5f5',
  },
};
```

## 📦 依赖

新增的主要依赖：
- `react-native-paper` - Material Design组件库
- `react-native-vector-icons` - 图标支持
- `react-native-safe-area-context` - 安全区域处理

## 🛠️ 安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 运行iOS
npm run ios

# 运行Android
npm run android
```

## 📱 界面预览

重构后的界面包含：
- 现代化的顶部导航栏
- 卡片式消息气泡
- 浮动操作按钮
- 分段选择器
- 优雅的设置界面

## 🔧 配置

在设置界面中配置各个AI供应商的：
- API密钥
- 基础URL
- 模型选择
- 启用/禁用状态

## 🎨 自定义主题

可以通过修改 `App.js` 中的 `theme` 对象来自定义应用主题：

```javascript
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#your-color',
    // ... 其他颜色
  },
};
``` 