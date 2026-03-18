package models

import (
	"time"
)

// User 用户模型
type User struct {
	ID        string    `json:"id" gorm:"primaryKey;type:varchar(12)"`
	Email     string    `json:"email" gorm:"uniqueIndex;not null"`
	Password  string    `json:"-" gorm:"not null"`
	Name      string    `json:"name" gorm:"not null"`
	Avatar    string    `json:"avatar" gorm:"default:''"`
	IsAdmin   bool      `json:"isAdmin" gorm:"default:false"`
	CreatedAt time.Time `json:"createdAt"`
	LastLoginAt *time.Time `json:"lastLoginAt"`
}

// MediaItem 媒体项目模型
type MediaItem struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title" gorm:"not null"`
	Type        string    `json:"type" gorm:"not null"` // image or video
	URL         string    `json:"url" gorm:"not null"`
	Category    string    `json:"category" gorm:"not null"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
}

// Comment 评论模型
type Comment struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	UserID     string    `json:"userId" gorm:"not null"`
	UserName   string    `json:"userName" gorm:"not null"`
	UserAvatar string    `json:"userAvatar" gorm:"not null"`
	UserEmail  string    `json:"userEmail" gorm:"not null"`
	Content    string    `json:"content" gorm:"not null"`
	MediaURL   string    `json:"mediaUrl"`
	MediaType  string    `json:"mediaType"`
	TargetID   string    `json:"targetId" gorm:"index"`
	TargetType string    `json:"targetType" gorm:"index"`
	CreatedAt  time.Time `json:"createdAt"`
}

// Like 点赞模型
type Like struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	UserID     string    `json:"userId" gorm:"not null"`
	UserName   string    `json:"userName" gorm:"not null"`
	UserAvatar string    `json:"userAvatar" gorm:"not null"`
	TargetID   string    `json:"targetId" gorm:"not null;index"`
	TargetType string    `json:"targetType" gorm:"not null;index"`
	CreatedAt  time.Time `json:"createdAt"`
}

// ActivityLog 活动日志模型
type ActivityLog struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	Type       string    `json:"type" gorm:"not null"` // visit, login, comment, like
	UserID     string    `json:"userId"`
	UserName   string    `json:"userName"`
	UserAvatar string    `json:"userAvatar"`
	TargetID   string    `json:"targetId"`
	TargetType string    `json:"targetType"`
	Details    string    `json:"details"`
	IP         string    `json:"ip"`
	UserAgent  string    `json:"userAgent"`
	CreatedAt  time.Time `json:"createdAt"`
}