#!/bin/bash
# 修复Nginx配置脚本

echo "正在修复Nginx配置..."

# 备份原配置
cp /etc/nginx/conf.d/portfolio.conf /etc/nginx/conf.d/portfolio.conf.bak.$(date +%Y%m%d%H%M%S)

# 写入新配置
cat > /etc/nginx/conf.d/portfolio.conf << 'EOF'
server {
    listen 80;
    server_name 121.196.175.173;

    # 前端静态文件
    location / {
        root /usr/share/nginx/html/portfolio/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API代理 - 修复CORS和重定向问题
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 添加CORS头
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        
        # 处理OPTIONS预检请求
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}
EOF

# 测试配置
echo "测试Nginx配置..."
nginx -t

if [ $? -eq 0 ]; then
    echo "配置测试成功，重新加载Nginx..."
    systemctl reload nginx
    echo "✅ Nginx配置已修复并重新加载！"
else
    echo "❌ 配置测试失败，请检查错误"
    exit 1
fi
