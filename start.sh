#!/bin/bash
cd backend
go mod tidy
go run cmd/server/main.go
