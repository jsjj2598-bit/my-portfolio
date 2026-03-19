package services

import (
	"time"

	"github.com/jsjj2598-bit/my-portfolio-backend/internal/models"
	"github.com/jsjj2598-bit/my-portfolio-backend/internal/storage"
)

// LogService 活动日志服务
type LogService struct{}

// NewLogService 创建活动日志服务实例
func NewLogService() *LogService {
	return &LogService{}
}

// AddLog 添加活动日志
func (s *LogService) AddLog(log *models.ActivityLog) error {
	log.CreatedAt = time.Now()
	return storage.GetDB().Create(log).Error
}

// GetLogs 获取活动日志
func (s *LogService) GetLogs() ([]models.ActivityLog, error) {
	var logs []models.ActivityLog
	if err := storage.GetDB().Order("created_at DESC").Find(&logs).Error; err != nil {
		return nil, err
	}
	return logs, nil
}
