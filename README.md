# AI聊天助手 - React Native应用

一个功能丰富的AI聊天应用，支持多个AI供应商，具有Telegram风格的现代化界面。

## ✨ 功能特性

### 🤖 多AI供应商支持
- **OpenAI** (GPT-3.5, GPT-4) - 🤖
- **DeepSeek** (deepseek-chat, deepseek-reasoner) - 🧠
- **Anthropic** (Claude-3-sonnet, Claude-3-haiku) - 🎭
- **Google** (Gemini-pro, Gemini-pro-vision) - 🌟
- **自定义API** - ⚙️

### 💬 聊天功能
- **实时流式响应** - 打字机效果显示AI回复
- **Markdown渲染** - 支持代码块、列表、引用等格式
- **消息分组** - 连续消息智能分组显示
- **消息状态** - 发送状态和时间戳显示
- **打字指示器** - 动画效果显示AI正在输入

### 🎨 界面设计
- **Telegram风格** - 现代化聊天界面
- **动态头像** - 每个AI供应商专属图标
- **响应式设计** - 适配不同屏幕尺寸
- **平滑动画** - 流畅的界面交互效果
- **深色模式兼容** - 支持系统主题

### ⚙️ 配置管理
- **供应商管理** - 启用/禁用不同AI供应商
- **API配置** - 自定义API密钥和基础URL
- **模型选择** - 支持各供应商的多个模型
- **设置持久化** - 配置自动保存

## 🛠 技术栈

- **React Native** - 跨平台移动应用框架
- **Expo** - 开发和构建工具
- **React Navigation** - 导航管理
- **Animated API** - 动画效果
- **Markdown渲染** - react-native-markdown-display
- **异步存储** - 配置持久化

## 📦 安装和运行

### 前置要求
- Node.js 18+
- npm 或 yarn
- Expo CLI
- iOS模拟器或Android设备/模拟器

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd mystudio
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npx expo start
```

4. **运行应用**
- iOS: 按 `i` 或扫描二维码
- Android: 按 `a` 或扫描二维码
- Web: 按 `w`

## 📁 项目结构

```
mystudio/
├── App.js                      # 主应用组件
├── components/                 # 可复用组件
│   ├── MessageItem.js         # 消息项组件
│   ├── TypingIndicator.js     # 打字指示器
│   ├── ChatHeader.js          # 聊天头部
│   ├── MessageInput.js        # 消息输入框
│   ├── SettingsModal.js       # 设置界面
│   └── MarkdownStyles.js      # Markdown样式
├── assets/                     # 资源文件
├── package.json               # 项目配置
└── README.md                  # 项目说明
```

## 🔧 配置说明

### API密钥配置

在应用设置中配置各个AI供应商的API密钥：

#### OpenAI
- API密钥：从 [OpenAI](https://platform.openai.com/api-keys) 获取
- 基础URL：`https://api.openai.com/v1`

#### DeepSeek
- API密钥：从 [DeepSeek](https://platform.deepseek.com/api-keys) 获取
- 基础URL：`https://api.deepseek.com/v1`

#### Anthropic
- API密钥：从 [Anthropic](https://console.anthropic.com/) 获取
- 基础URL：`https://api.anthropic.com`

#### Google
- API密钥：从 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取
- 基础URL：`https://generativelanguage.googleapis.com/v1`

### 自定义API
支持配置自定义的OpenAI兼容API端点。

## 🚀 使用说明

### 基本聊天
1. 打开应用，选择AI供应商
2. 在输入框中输入消息
3. 点击发送按钮或按回车键
4. 观看AI实时回复

### 切换AI供应商
1. 点击右上角设置按钮
2. 在"AI模型供应商"中选择
3. 点击保存返回聊天

### 配置API
1. 进入设置界面
2. 找到对应供应商配置
3. 输入API密钥和基础URL
4. 启用该供应商
5. 保存配置

### Markdown功能
AI回复支持以下Markdown格式：
- **粗体文本**
- *斜体文本*
- `代码片段`
- 代码块
- 列表项
- 引用文本
- 链接

## 🔄 开发说明

### 组件架构
- **MessageItem**: 处理消息渲染和Markdown显示
- **TypingIndicator**: 显示AI输入状态
- **ChatHeader**: 显示当前AI供应商信息
- **MessageInput**: 处理用户输入和发送
- **SettingsModal**: 管理应用配置

### API集成
- 支持OpenAI格式的流式API
- 自动处理不同供应商的API差异
- 错误处理和超时机制
- 流式响应的实时显示

### 样式系统
- 模块化的样式管理
- 响应式设计适配
- 动画效果统一管理

## 🐛 故障排除

### 常见问题

**1. API调用失败**
- 检查API密钥是否正确
- 确认网络连接正常
- 验证基础URL设置

**2. 流式响应异常**
- React Native不支持原生ReadableStream
- 应用已适配React Native环境

**3. 组件加载错误**
- 确保所有依赖正确安装
- 检查组件导入路径

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目！

### 开发流程
1. Fork项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 创建Issue
- 发送邮件
- 项目讨论区

---

## 🎉 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd mystudio

# 安装依赖
npm install

# 启动应用
npx expo start

# 在手机上扫描二维码即可开始使用！
```

**享受与AI的智能对话体验！** 🚀 