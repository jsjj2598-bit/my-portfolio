package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jsjj2598-bit/my-portfolio-backend/internal/models"
	"github.com/jsjj2598-bit/my-portfolio-backend/internal/services"
)

// LogHandler 活动日志处理器
type LogHandler struct {
	logService *services.LogService
}

// NewLogHandler 创建活动日志处理器
func NewLogHandler() *LogHandler {
	return &LogHandler{
		logService: services.NewLogService(),
	}
}

// GetLogs 获取活动日志
func (h *LogHandler) GetLogs(c *gin.Context) {
	logs, err := h.logService.GetLogs()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, logs)
}

// AddLog 添加活动日志
func (h *LogHandler) AddLog(c *gin.Context) {
	var log models.ActivityLog
	if err := c.ShouldBindJSON(&log); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 设置 IP 和 User-Agent
	log.IP = c.ClientIP()
	log.UserAgent = c.Request.UserAgent()

	err := h.logService.AddLog(&log)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, log)
}
