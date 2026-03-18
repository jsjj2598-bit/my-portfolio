package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort string
	DatabaseURL string
	JWTSecret string
	AdminPassword string
}

var AppConfig *Config

func Load() {
	// 加载 .env 文件
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	AppConfig = &Config{
		ServerPort: getEnv("SERVER_PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/portfolio?sslmode=disable"),
		JWTSecret: getEnv("JWT_SECRET", ""),
		AdminPassword: getEnv("ADMIN_PASSWORD", "admin123"),
	}
	
	// 验证JWT密钥是否设置
	if AppConfig.JWTSecret == "" {
		log.Fatal("Error: JWT_SECRET environment variable is required")
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}