package main

import (
	"fmt"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/yourusername/portfolio/backend/config"
	"github.com/yourusername/portfolio/backend/internal/api"
	"github.com/yourusername/portfolio/backend/internal/middleware"
	"github.com/yourusername/portfolio/backend/internal/storage"
)

func main() {
	// 加载配置
	config.Load()

	// 初始化数据库
	storage.Init()

	// 创建 Gin 引擎
	r := gin.Default()

	// 配置 CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "https://longperson.cn", "https://www.longperson.cn", "https://my-portfolio-eele.vercel.app", "https://www.my-portfolio-eele.vercel.app"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// 创建 API 处理器
	authHandler := api.NewAuthHandler()
	userHandler := api.NewUserHandler()
	mediaHandler := api.NewMediaHandler()
	commentHandler := api.NewCommentHandler()
	logHandler := api.NewLogHandler()

	// 公共路由
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Server is running",
		})
	})

	// API 路由组
	apiGroup := r.Group("/api")
	{
		// 认证路由
		authGroup := apiGroup.Group("/auth")
		{
			authGroup.POST("/register", authHandler.Register)
			authGroup.POST("/login", authHandler.Login)
		}

		// 媒体路由
		mediaGroup := apiGroup.Group("/media")
		{
			mediaGroup.GET("/", mediaHandler.GetMediaItems)
			mediaGroup.POST("/", mediaHandler.AddMediaItem)
			mediaGroup.PUT("/", mediaHandler.UpdateMediaItem)
			mediaGroup.DELETE("/", mediaHandler.DeleteMediaItem)
		}

		// 评论路由
		commentGroup := apiGroup.Group("/comments")
		{
			commentGroup.GET("/", commentHandler.GetComments)
			commentGroup.POST("/", middleware.JWTAuth(), commentHandler.AddComment)
			commentGroup.DELETE("/", middleware.JWTAuth(), commentHandler.DeleteComment)
			commentGroup.POST("/like", middleware.JWTAuth(), commentHandler.ToggleLike)
		}

		// 活动日志路由
		logGroup := apiGroup.Group("/logs")
		{
			logGroup.GET("/", middleware.AdminAuth(), logHandler.GetLogs)
			logGroup.POST("/", logHandler.AddLog)
		}

		// 用户管理路由
		userGroup := apiGroup.Group("/users")
		userGroup.Use(middleware.AdminAuth())
		{
			userGroup.GET("/", userHandler.GetUsers)
			userGroup.PUT("/", userHandler.UpdateUserAdmin)
			userGroup.DELETE("/", userHandler.DeleteUser)
		}
	}

	// 启动服务器
	port := config.AppConfig.ServerPort
	fmt.Printf("Server running on port %s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}