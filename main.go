package main

import (
	_ "embed"
	libsse "github.com/alexandrevicenzi/go-sse"
	"github.com/gin-gonic/gin"
	sloggin "github.com/samber/slog-gin"
	"log"
	"log/slog"
)
import "github.com/gin-contrib/cors"

func main() {
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(sloggin.New(slog.Default()))
	r.Use(cors.Default())
	_ = r.SetTrustedProxies(nil)

	sse := libsse.NewServer(&libsse.Options{
		Logger: log.Default(),
	})

	r.GET("/_sse", func(c *gin.Context) {
		sse.ServeHTTP(c.Writer, c.Request)

		// TODO: forward API to SSE
	})

	_ = r.Run(":8080")
}
