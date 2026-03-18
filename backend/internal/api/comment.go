package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/portfolio/internal/models"
	"github.com/yourusername/portfolio/internal/services"
)

// CommentHandler 评论处理器
type CommentHandler struct {
	commentService *services.CommentService
	logService     *services.LogService
}

// NewCommentHandler 创建评论处理器
func NewCommentHandler() *CommentHandler {
	return &CommentHandler{
		commentService: services.NewCommentService(),
		logService:     services.NewLogService(),
	}
}

// GetComments 获取评论和点赞
func (h *CommentHandler) GetComments(c *gin.Context) {
	targetID := c.Query("targetId")
	targetType := c.Query("targetType")

	comments, likes, err := h.commentService.GetComments(targetID, targetType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"comments": comments,
		"likes":    likes,
	})
}

// AddComment 添加评论
func (h *CommentHandler) AddComment(c *gin.Context) {
	var comment models.Comment
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.commentService.AddComment(&comment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 记录评论日志
	h.logService.AddLog(&models.ActivityLog{
		Type:       "comment",
		UserID:     comment.UserID,
		UserName:   comment.UserName,
		UserAvatar: comment.UserAvatar,
		TargetID:   comment.TargetID,
		TargetType: comment.TargetType,
		Details:    comment.Content,
		IP:         c.ClientIP(),
		UserAgent:  c.Request.UserAgent(),
	})

	c.JSON(http.StatusOK, comment)
}

// DeleteComment 删除评论
func (h *CommentHandler) DeleteComment(c *gin.Context) {
	idStr := c.Query("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid id"})
		return
	}

	err = h.commentService.DeleteComment(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

// ToggleLike 切换点赞状态
func (h *CommentHandler) ToggleLike(c *gin.Context) {
	var like models.Like
	if err := c.ShouldBindJSON(&like); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	liked, err := h.commentService.ToggleLike(&like)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 重新获取点赞列表
	_, likes, err := h.commentService.GetComments(like.TargetID, like.TargetType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 记录点赞日志
	if liked {
		h.logService.AddLog(&models.ActivityLog{
			Type:       "like",
			UserID:     like.UserID,
			UserName:   like.UserName,
			UserAvatar: like.UserAvatar,
			TargetID:   like.TargetID,
			TargetType: like.TargetType,
			IP:         c.ClientIP(),
			UserAgent:  c.Request.UserAgent(),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"likes":  likes,
		"liked": liked,
	})
}