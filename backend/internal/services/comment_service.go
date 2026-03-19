package services

import (
	"github.com/jsjj2598-bit/my-portfolio-backend/internal/models"
	"github.com/jsjj2598-bit/my-portfolio-backend/internal/storage"
)

// CommentService 评论服务
type CommentService struct{}

// NewCommentService 创建评论服务实例
func NewCommentService() *CommentService {
	return &CommentService{}
}

// GetComments 获取评论
func (s *CommentService) GetComments(targetID, targetType string) ([]models.Comment, []models.Like, error) {
	var comments []models.Comment
	var likes []models.Like

	// 获取评论
	query := storage.GetDB()
	if targetID != "" && targetType != "" {
		query = query.Where("target_id = ? AND target_type = ?", targetID, targetType)
	}
	if err := query.Find(&comments).Error; err != nil {
		return nil, nil, err
	}

	// 获取点赞
	query = storage.GetDB()
	if targetID != "" && targetType != "" {
		query = query.Where("target_id = ? AND target_type = ?", targetID, targetType)
	}
	if err := query.Find(&likes).Error; err != nil {
		return nil, nil, err
	}

	return comments, likes, nil
}

// AddComment 添加评论
func (s *CommentService) AddComment(comment *models.Comment) error {
	return storage.GetDB().Create(comment).Error
}

// DeleteComment 删除评论
func (s *CommentService) DeleteComment(id uint) error {
	return storage.GetDB().Delete(&models.Comment{}, id).Error
}

// ToggleLike 切换点赞状态
func (s *CommentService) ToggleLike(like *models.Like) (bool, error) {
	// 检查是否已点赞
	var existingLike models.Like
	result := storage.GetDB().Where(
		"user_id = ? AND target_id = ? AND target_type = ?",
		like.UserID, like.TargetID, like.TargetType,
	).First(&existingLike)

	if result.RowsAffected > 0 {
		// 已点赞，取消点赞
		if err := storage.GetDB().Delete(&existingLike).Error; err != nil {
			return false, err
		}
		return false, nil
	}

	// 未点赞，添加点赞
	if err := storage.GetDB().Create(like).Error; err != nil {
		return false, err
	}
	return true, nil
}
