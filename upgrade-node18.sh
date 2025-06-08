#!/bin/bash
# 伴集 Admin - Node.js v18+ 升级脚本
# 支持 Node.js v12+，推荐 v18+

echo "🚀 开始升级 伴集 Admin 到 Node.js v18+ 兼容版本..."

# 检查 Node.js 版本
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
echo "当前 Node.js 版本: $(node --version)"

if [ "$NODE_VERSION" -lt 12 ]; then
    echo "❌ 错误: 需要 Node.js v12 或更高版本"
    echo "请先升级 Node.js:"
    echo "  - 使用 nvm: nvm install 18 && nvm use 18"
    echo "  - 或访问 https://nodejs.org 下载最新版本"
    exit 1
elif [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  当前版本: Node.js v${NODE_VERSION}"
    echo "✅ 项目兼容此版本，但推荐升级到 v18+ 以获得最佳体验"
    echo "   安装过程中可能会出现版本警告，这是正常的"
else
    echo "✅ Node.js 版本检查通过 - 推荐版本"
fi

# 备份当前的 package-lock.json
if [ -f "package-lock.json" ]; then
    echo "📦 备份当前 package-lock.json..."
    cp package-lock.json package-lock.json.backup
fi

# 清理旧的依赖
echo "🧹 清理旧的依赖..."
rm -rf node_modules
rm -f package-lock.json

# 设置 npm 配置（可选，提高安装速度）
echo "⚙️  配置 npm..."
npm config set registry https://registry.npm.taobao.org

# 安装新的依赖
echo "📦 安装更新后的依赖包..."
npm install

# 检查安装结果
if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功！"
else
    echo "❌ 依赖安装失败，正在恢复备份..."
    if [ -f "package-lock.json.backup" ]; then
        mv package-lock.json.backup package-lock.json
        npm install
    fi
    exit 1
fi

# 运行开发服务器测试
echo "🧪 测试开发服务器启动..."
timeout 10s npm run dev > /dev/null 2>&1 &
DEV_PID=$!

sleep 5
if kill -0 $DEV_PID 2>/dev/null; then
    echo "✅ 开发服务器启动成功！"
    kill $DEV_PID
else
    echo "⚠️  开发服务器启动可能有问题，请手动运行 npm run dev 检查"
fi

# 清理备份文件
if [ -f "package-lock.json.backup" ]; then
    rm package-lock.json.backup
fi

echo ""
echo "🎉 升级完成！"
echo ""
echo "接下来你可以："
echo "  📚 查看 README.md 了解完整的使用说明"
echo "  🚀 运行 npm run dev 启动开发服务器"
echo "  🏗️  运行 npm run build:prod 构建生产版本"
echo ""
echo "如遇问题，请参考 README.md 中的故障排除部分" 