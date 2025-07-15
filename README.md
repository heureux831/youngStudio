# MyStudio - 项目管理与笔记应用

一个功能丰富的个人生产力应用，集项目管理、笔记记录和文档编写于一体。使用 React Native Paper 构建，提供现代化的 Material Design 界面。

## 📱 应用概览

MyStudio 是一个专为个人和团队设计的生产力工具，包含以下核心功能：

- 📝 **速记功能** - 快速记录想法和灵感
- 📊 **项目管理** - 管理个人和工作项目，支持时间规划
- 📁 **输入箱** - 收集和整理各类信息
- 👤 **个人中心** - 查看统计数据和应用设置

## ✨ 主要特性

### 🎯 项目管理
- **项目分类管理** - 支持个人项目、工作项目、兴趣项目等
- **子项目支持** - 每个主项目可包含多个子项目
- **时间配置** - 为每个子项目设置开始和结束时间
- **文档编写** - 每个子项目都有专门的文档编辑区域
- **项目编辑** - 可修改项目名称和添加新的子项目

### 📝 笔记系统
- **快速记录** - 支持速记功能，快速捕捉想法
- **分类管理** - 按类别组织笔记
- **Markdown支持** - 富文本编辑和显示
- **读取状态** - 追踪笔记的阅读状态

### 🎨 现代化界面
- **Material Design 3** - 遵循最新的设计规范
- **响应式布局** - 适配不同屏幕尺寸
- **深色模式支持** - 可切换浅色/深色主题
- **优雅动画** - 流畅的交互体验

### 💾 数据管理
- **本地存储** - 使用 AsyncStorage 进行数据持久化
- **自动保存** - 数据变化时自动保存
- **数据安全** - 本地加密存储，保护用户隐私

## 🛠️ 技术栈

- **框架**: React Native + Expo
- **UI组件**: React Native Paper (Material Design)
- **导航**: React Navigation 6
- **状态管理**: React Context + Hooks
- **本地存储**: AsyncStorage
- **图标**: Material Icons (@expo/vector-icons)
- **样式**: StyleSheet + 主题系统

## 📦 项目结构

```
mystudio/
├── App.js                    # 应用入口和导航配置
├── assets/                   # 静态资源
├── components/               # 可复用组件
│   ├── ChatHeader.js
│   ├── MessageInput.js
│   └── ...
├── context/
│   └── AppContext.js        # 全局状态管理
├── screens/                 # 页面组件
│   ├── QuickNoteScreen.js   # 速记页面
│   ├── InboxScreen.js       # 输入箱页面
│   ├── ProjectsScreen.js    # 项目管理页面
│   ├── ProjectItemDetailScreen.js  # 项目详情页面
│   └── ProfileScreen.js     # 个人中心页面
├── app.json.template        # 配置文件模板
└── package.json            # 依赖配置
```

## 🚀 快速开始

### 1. 环境要求

- Node.js 16+ 
- npm 或 yarn
- Expo CLI
- iOS/Android 开发环境（可选）

### 2. 安装依赖

```bash
# 克隆项目
git clone https://github.com/your-username/mystudio.git
cd mystudio

# 安装依赖
npm install

# 安装 Expo CLI（如果尚未安装）
npm install -g @expo/cli
```

### 3. 配置项目

**重要：配置 app.json 文件**

```bash
# 复制模板文件
cp app.json.template app.json
```

然后编辑 `app.json` 文件：

1. **获取 Expo Project ID**
   - 登录 [Expo 开发者控制台](https://expo.dev/)
   - 创建新项目或选择现有项目
   - 复制项目的 Project ID

2. **更新配置文件**
   在 `app.json` 中找到：
   ```json
   "extra": {
     "eas": {
       "projectId": "YOUR_PROJECT_ID_HERE"
     }
   }
   ```
   将 `YOUR_PROJECT_ID_HERE` 替换为您的实际 Project ID。

### 4. 启动应用

```bash
# 启动开发服务器
npm start

# 或者直接运行特定平台
npm run ios      # iOS 模拟器
npm run android  # Android 模拟器
npm run web      # Web 浏览器
```

## 📱 功能使用指南

### 项目管理
1. **创建项目**: 点击右下角的 FAB 按钮
2. **编辑项目**: 点击项目标题旁的编辑图标
3. **添加子项目**: 展开项目后点击"添加子项目"按钮
4. **管理子项目**: 点击子项目右侧箭头进入详情页面
5. **配置时间**: 在详情页面设置开始和结束时间
6. **编写文档**: 在详情页面的文档区域记录项目信息

### 笔记功能
1. **速记**: 在速记页面快速记录想法
2. **分类**: 为笔记选择合适的分类
3. **查看**: 在输入箱页面查看所有笔记
4. **标记**: 标记笔记为已读状态

### 个人中心
- 查看数据统计（笔记数、项目数、子项目数）
- 调整应用设置（通知、深色模式等）
- 管理数据（备份、导出、恢复）

## 🔧 开发指南

### 主题自定义

在 `App.js` 中修改主题配置：

```javascript
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',      // 主色调
    secondary: '#1976D2',    // 辅色调
    surface: '#ffffff',      // 表面颜色
    background: '#ffffff',   // 背景颜色
  },
};
```

### 添加新功能

1. **创建新页面**: 在 `screens/` 目录下创建新组件
2. **添加导航**: 在 `App.js` 中配置路由
3. **状态管理**: 在 `AppContext.js` 中添加相关状态和操作
4. **数据持久化**: 更新 `loadData` 和 `saveData` 函数

## 🔒 数据安全

- **本地存储**: 数据存储在设备本地，不会上传到云端
- **隐私保护**: 应用不收集个人信息
- **数据控制**: 用户完全控制自己的数据
- **备份建议**: 建议定期导出数据进行备份

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件


*MyStudio - 让你的想法和项目井然有序* ✨ 