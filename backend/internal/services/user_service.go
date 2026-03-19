package services

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math/rand"
	"time"

	"github.com/jsjj2598-bit/my-portfolio-backend/internal/models"
	"github.com/jsjj2598-bit/my-portfolio-backend/internal/storage"
)

// UserService 用户服务
type UserService struct{}

// NewUserService 创建用户服务实例
func NewUserService() *UserService {
	return &UserService{}
}

// generateUserID 生成12位随机用户ID
func generateUserID() string {
	const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	result := make([]byte, 12)
	for i := range result {
		result[i] = charset[r.Intn(len(charset))]
	}
	return string(result)
}

// hashPassword 密码哈希
func hashPassword(password string) string {
	hash := sha256.Sum256([]byte(password))
	return hex.EncodeToString(hash[:])
}

// Register 用户注册
func (s *UserService) Register(email, password, name string) (*models.User, error) {
	// 检查邮箱是否已存在
	var existingUser models.User
	result := storage.GetDB().Where("email = ?", email).First(&existingUser)
	if result.RowsAffected > 0 {
		return nil, fmt.Errorf("email already exists")
	}

	// 生成用户ID
	userID := generateUserID()

	// 生成默认头像
	avatar := fmt.Sprintf("https://ui-avatars.com/api/?name=%s&background=random", name)

	// 创建用户
	user := &models.User{
		ID:       userID,
		Email:    email,
		Password: hashPassword(password),
		Name:     name,
		Avatar:   avatar,
		IsAdmin:  false,
	}

	// 保存到数据库
	if err := storage.GetDB().Create(user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

// Login 用户登录
func (s *UserService) Login(email, password string) (*models.User, error) {
	// 查找用户
	var user models.User
	result := storage.GetDB().Where("email = ?", email).First(&user)
	if result.RowsAffected == 0 {
		return nil, fmt.Errorf("invalid email or password")
	}

	// 验证密码
	if user.Password != hashPassword(password) {
		return nil, fmt.Errorf("invalid email or password")
	}

	// 更新最后登录时间
	now := time.Now()
	user.LastLoginAt = &now
	if err := storage.GetDB().Save(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

// GetUsers 获取所有用户
func (s *UserService) GetUsers() ([]models.User, error) {
	var users []models.User
	if err := storage.GetDB().Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// UpdateUserAdmin 更新用户管理员权限
func (s *UserService) UpdateUserAdmin(userID string, isAdmin bool) error {
	result := storage.GetDB().Model(&models.User{}).Where("id = ?", userID).Update("is_admin", isAdmin)
	if result.RowsAffected == 0 {
		return fmt.Errorf("user not found")
	}
	return result.Error
}

// DeleteUser 删除用户
func (s *UserService) DeleteUser(userID string) error {
	result := storage.GetDB().Delete(&models.User{}, "id = ?", userID)
	if result.RowsAffected == 0 {
		return fmt.Errorf("user not found")
	}
	return result.Error
}

// GetUserByID 根据ID获取用户
func (s *UserService) GetUserByID(userID string) (*models.User, error) {
	var user models.User
	result := storage.GetDB().Where("id = ?", userID).First(&user)
	if result.RowsAffected == 0 {
		return nil, fmt.Errorf("user not found")
	}
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}
