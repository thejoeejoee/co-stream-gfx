package main

import (
	_ "embed"
	"fmt"
	libsse "github.com/alexandrevicenzi/go-sse"
	"github.com/gin-gonic/gin"
	sloggin "github.com/samber/slog-gin"
	"io"
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

	r.NoRoute(func(c *gin.Context) {
		b, _ := io.ReadAll(c.Request.Body)

		slog.Info("req", "p", c.Request.URL.Path, "b", string(b))

		fmt.Println(string(b))
	})

	_ = r.Run(":8080")
}
