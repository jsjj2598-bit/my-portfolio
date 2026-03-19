package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jsjj2598-bit/my-portfolio-backend/internal/services"
)

// UserHandler 用户处理器
type UserHandler struct {
	userService *services.UserService
}

// NewUserHandler 创建用户处理器
func NewUserHandler() *UserHandler {
	return &UserHandler{
		userService: services.NewUserService(),
	}
}

// GetUsers 获取所有用户
func (h *UserHandler) GetUsers(c *gin.Context) {
	users, err := h.userService.GetUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

// UpdateUserAdmin 更新用户管理员权限
type UpdateUserAdminRequest struct {
	ID      string `json:"id" binding:"required"`
	IsAdmin bool   `json:"isAdmin"`
}

func (h *UserHandler) UpdateUserAdmin(c *gin.Context) {
	var req UpdateUserAdminRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.userService.UpdateUserAdmin(req.ID, req.IsAdmin)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

// DeleteUserRequest 删除用户请求
type DeleteUserRequest struct {
	ID string `json:"id" binding:"required"`
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	var req DeleteUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.userService.DeleteUser(req.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
