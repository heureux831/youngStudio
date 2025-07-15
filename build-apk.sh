#!/bin/bash

echo "🚀 AI聊天助手 APK构建脚本"
echo "================================"

# 检查EAS CLI是否安装
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI 未安装"
    echo "正在安装 EAS CLI..."
    npm install -g eas-cli
fi

echo "✅ EAS CLI 已安装"

# 检查是否已登录
echo "🔐 检查登录状态..."
if ! eas whoami &> /dev/null; then
    echo "请登录您的 Expo 账户："
    eas login
fi

echo "✅ 已登录"

# 询问构建类型
echo ""
echo "请选择构建类型："
echo "1) Preview APK (推荐，用于测试)"
echo "2) Production APK (用于发布)"
echo "3) 专用 APK 配置"

read -p "请输入选择 (1-3): " choice

case $choice in
    1)
        echo "🔨 开始构建 Preview APK..."
        eas build --platform android --profile preview
        ;;
    2)
        echo "🔨 开始构建 Production APK..."
        eas build --platform android --profile production
        ;;
    3)
        echo "🔨 开始构建专用 APK..."
        eas build --platform android --profile apk
        ;;
    *)
        echo "❌ 无效选择，使用默认 Preview 配置"
        eas build --platform android --profile preview
        ;;
esac

echo ""
echo "📱 构建完成后，你可以："
echo "1. 在 https://expo.dev 查看构建状态"
echo "2. 下载 APK 文件"
echo "3. 传输到 Android 设备安装"
echo ""
echo "🎉 感谢使用 AI聊天助手！" 