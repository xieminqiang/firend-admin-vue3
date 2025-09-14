#!/bin/bash

# CORS 修复部署脚本
# 用于修复生产环境的跨域问题

echo "🚀 开始修复 CORS 跨域问题..."

# 1. 构建生产版本
echo "📦 构建生产版本..."
npm run build

# 2. 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

# 3. 备份当前nginx配置
echo "💾 备份当前nginx配置..."
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)

# 4. 应用新的nginx配置
echo "🔧 应用新的nginx配置..."
sudo cp nginx-http-only.conf /etc/nginx/nginx.conf

# 5. 测试nginx配置
echo "🧪 测试nginx配置..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ nginx配置测试通过"
    
    # 6. 重启nginx
    echo "🔄 重启nginx服务..."
    sudo systemctl reload nginx
    
    if [ $? -eq 0 ]; then
        echo "✅ nginx重启成功"
    else
        echo "❌ nginx重启失败，请手动检查"
        exit 1
    fi
else
    echo "❌ nginx配置测试失败，请检查配置"
    exit 1
fi

# 7. 复制构建文件到服务器目录
echo "📁 复制构建文件到服务器目录..."
sudo cp -r dist/* /www/wwwroot/www.suibanxing.cn/

# 8. 设置正确的权限
echo "🔐 设置文件权限..."
sudo chown -R www:www /www/wwwroot/www.suibanxing.cn/
sudo chmod -R 755 /www/wwwroot/www.suibanxing.cn/

echo "🎉 CORS 修复完成！"
echo ""
echo "📋 修复内容："
echo "   ✅ 修复了nginx代理配置"
echo "   ✅ 优化了CORS头设置"
echo "   ✅ 调整了环境变量配置"
echo "   ✅ 处理了OPTIONS预检请求"
echo ""
echo "🌐 请访问 https://www.suibanxing.cn 测试功能"
echo "📊 查看nginx日志: tail -f /www/wwwlogs/www.suibanxing.cn.access.log"
