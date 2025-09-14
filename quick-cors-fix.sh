#!/bin/bash

# 快速CORS修复脚本
echo "🚀 开始快速修复CORS问题..."

# 1. 备份当前nginx配置
echo "💾 备份当前nginx配置..."
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)

# 2. 使用简化的HTTP配置进行测试
echo "🔧 应用简化的nginx配置..."
sudo cp nginx-http-test.conf /etc/nginx/nginx.conf

# 3. 测试nginx配置
echo "🧪 测试nginx配置..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ nginx配置测试通过"
    
    # 4. 重启nginx
    echo "🔄 重启nginx服务..."
    sudo systemctl reload nginx
    
    if [ $? -eq 0 ]; then
        echo "✅ nginx重启成功"
        
        # 5. 构建并部署前端
        echo "📦 构建前端项目..."
        npm run build
        
        if [ $? -eq 0 ]; then
            echo "✅ 前端构建成功"
            
            # 6. 部署前端文件
            echo "📁 部署前端文件..."
            sudo cp -r dist/* /www/wwwroot/www.suibanxing.cn/
            sudo chown -R www:www /www/wwwroot/www.suibanxing.cn/
            sudo chmod -R 755 /www/wwwroot/www.suibanxing.cn/
            
            echo "🎉 CORS修复完成！"
            echo ""
            echo "📋 修复内容："
            echo "   ✅ 使用HTTP版本避免SSL证书问题"
            echo "   ✅ 修复nginx代理配置"
            echo "   ✅ 优化CORS头设置"
            echo "   ✅ 处理OPTIONS预检请求"
            echo ""
            echo "🌐 请访问 http://www.suibanxing.cn 测试功能"
            echo "📊 查看nginx日志: tail -f /www/wwwlogs/www.suibanxing.cn.access.log"
            echo ""
            echo "⚠️  注意：当前使用HTTP版本，生产环境建议配置SSL证书后使用HTTPS"
        else
            echo "❌ 前端构建失败"
            exit 1
        fi
    else
        echo "❌ nginx重启失败"
        exit 1
    fi
else
    echo "❌ nginx配置测试失败，请检查配置"
    exit 1
fi


