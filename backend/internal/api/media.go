package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/portfolio/internal/models"
	"github.com/yourusername/portfolio/internal/services"
)

// MediaHandler 媒体处理器
type MediaHandler struct {
	mediaService *services.MediaService
}

// NewMediaHandler 创建媒体处理器
func NewMediaHandler() *MediaHandler {
	return &MediaHandler{
		mediaService: services.NewMediaService(),
	}
}

// GetMediaItems 获取所有媒体项目
func (h *MediaHandler) GetMediaItems(c *gin.Context) {
	items, err := h.mediaService.GetMediaItems()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, items)
}

// AddMediaItem 添加媒体项目
func (h *MediaHandler) AddMediaItem(c *gin.Context) {
	var item models.MediaItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.mediaService.AddMediaItem(&item)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, item)
}

// UpdateMediaItem 更新媒体项目
func (h *MediaHandler) UpdateMediaItem(c *gin.Context) {
	var item models.MediaItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.mediaService.UpdateMediaItem(&item)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, item)
}

// DeleteMediaItem 删除媒体项目
func (h *MediaHandler) DeleteMediaItem(c *gin.Context) {
	idStr := c.Query("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid id"})
		return
	}

	err = h.mediaService.DeleteMediaItem(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}