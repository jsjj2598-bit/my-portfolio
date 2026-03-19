#!/bin/bash

# 设置Go环境变量
export GO111MODULE=on

# 安装依赖
go mod tidy

# 构建应用
go build -o server cmd/server/main.go

# 确保可执行权限
chmod +x server
