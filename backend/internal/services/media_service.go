package services

import (
	"github.com/yourusername/portfolio/backend/internal/models"
	"github.com/yourusername/portfolio/backend/internal/storage"
)

// MediaService 媒体服务
type MediaService struct{}

// NewMediaService 创建媒体服务实例
func NewMediaService() *MediaService {
	return &MediaService{}
}

// GetMediaItems 获取所有媒体项目
func (s *MediaService) GetMediaItems() ([]models.MediaItem, error) {
	var items []models.MediaItem
	if err := storage.GetDB().Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

// AddMediaItem 添加媒体项目
func (s *MediaService) AddMediaItem(item *models.MediaItem) error {
	return storage.GetDB().Create(item).Error
}

// UpdateMediaItem 更新媒体项目
func (s *MediaService) UpdateMediaItem(item *models.MediaItem) error {
	return storage.GetDB().Save(item).Error
}

// DeleteMediaItem 删除媒体项目
func (s *MediaService) DeleteMediaItem(id uint) error {
	return storage.GetDB().Delete(&models.MediaItem{}, id).Error
}