package storage

import (
	"fmt"
	"log"

	"github.com/jsjj2598-bit/my-portfolio-backend/config"
	"github.com/jsjj2598-bit/my-portfolio-backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {
	var err error

	// 连接数据库
	DB, err = gorm.Open(postgres.Open(config.AppConfig.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	fmt.Println("Database connected successfully")

	// 自动迁移
	err = DB.AutoMigrate(
		&models.User{},
		&models.MediaItem{},
		&models.Comment{},
		&models.Like{},
		&models.ActivityLog{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	fmt.Println("Database migrated successfully")
}

// GetDB 获取数据库连接
func GetDB() *gorm.DB {
	return DB
}
