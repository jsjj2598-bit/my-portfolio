package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jsjj2598-bit/my-portfolio-backend/config"
	"github.com/jsjj2598-bit/my-portfolio-backend/internal/models"
	"github.com/jsjj2598-bit/my-portfolio-backend/internal/services"
)

// AuthHandler 认证处理器
type AuthHandler struct {
	userService *services.UserService
	logService  *services.LogService
}

// NewAuthHandler 创建认证处理器
func NewAuthHandler() *AuthHandler {
	return &AuthHandler{
		userService: services.NewUserService(),
		logService:  services.NewLogService(),
	}
}

// RegisterRequest 注册请求
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Name     string `json:"name" binding:"required"`
}

// LoginRequest 登录请求
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Register 注册
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userService.Register(req.Email, req.Password, req.Name)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 生成 JWT token
	token, err := generateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// 记录注册日志
	h.logService.AddLog(&models.ActivityLog{
		Type:       "register",
		UserID:     user.ID,
		UserName:   user.Name,
		UserAvatar: user.Avatar,
		IP:         c.ClientIP(),
		UserAgent:  c.Request.UserAgent(),
	})

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id":     user.ID,
			"email":  user.Email,
			"name":   user.Name,
			"avatar": user.Avatar,
		},
	})
}

// Login 登录
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userService.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// 生成 JWT token
	token, err := generateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// 记录登录日志
	h.logService.AddLog(&models.ActivityLog{
		Type:       "login",
		UserID:     user.ID,
		UserName:   user.Name,
		UserAvatar: user.Avatar,
		IP:         c.ClientIP(),
		UserAgent:  c.Request.UserAgent(),
	})

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id":     user.ID,
			"email":  user.Email,
			"name":   user.Name,
			"avatar": user.Avatar,
		},
	})
}

// generateToken 生成 JWT token
func generateToken(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"userID":     user.ID,
		"userEmail":  user.Email,
		"userName":   user.Name,
		"userAvatar": user.Avatar,
		"isAdmin":    user.IsAdmin,
		"exp":        time.Now().Add(time.Hour * 24 * 7).Unix(), // 7天有效期
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.AppConfig.JWTSecret))
}
