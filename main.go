package main

import (
	_ "embed"
	libsse "github.com/alexandrevicenzi/go-sse"
	"github.com/gin-gonic/gin"
	sloggin "github.com/samber/slog-gin"
	"log"
	"log/slog"
	"time"
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

		go func() {
			for range 5 {
				msg := libsse.NewMessage("", "Hello, this is a message!", "")
				sse.SendMessage("", msg)

				<-time.After(1 * time.Second)
			}
		}()
	})

	_ = r.Run(":8080")
}
