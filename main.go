package main

import (
	_ "embed"
	libsse "github.com/alexandrevicenzi/go-sse"
	"github.com/gin-gonic/gin"
	"github.com/samber/lo"
	sloggin "github.com/samber/slog-gin"
	"io"
	"log"
	"log/slog"
	"net/http"
	"strings"
)
import "github.com/gin-contrib/cors"

func main() {
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(sloggin.New(slog.Default()))
	r.Use(cors.Default())
	_ = r.SetTrustedProxies(nil)

	const sseBaseUrl = "/_sse/"
	const defaultChannel = "default"

	sse := libsse.NewServer(&libsse.Options{
		Logger: log.Default(),
		ChannelNameFunc: func(request *http.Request) string {
			// take
			return lo.CoalesceOrEmpty(strings.TrimPrefix(request.URL.Path, sseBaseUrl), defaultChannel)
		},
	})

	//channels := xsync.MapOf[string, *libsse.Channel]

	r.GET("/_sse/", func(c *gin.Context) {
		sse.ServeHTTP(c.Writer, c.Request)
	})
	r.GET("/_sse/:channel", func(c *gin.Context) {
		sse.ServeHTTP(c.Writer, c.Request)
	})
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "OK")
	})

	r.NoRoute(func(c *gin.Context) {
		b, _ := io.ReadAll(c.Request.Body)

		// TODO: respond with more than just 200 OK
		c.Status(200)

		// TODO: append all bodies to log file

		// TODO: check all hide functions
		if c.Request.URL.Query().Get("Function") == "OverlayInputAllOff" {
			// kinda special, send event hide

			slog.InfoContext(c, "hide all")

			// plain data, just event hide
			sse.SendMessage(defaultChannel, libsse.NewMessage("", "{}", "hide"))
			return
		}

		event := lo.Must(lo.Last(strings.Split(c.Request.URL.Path, "/")))
		sse.SendMessage(defaultChannel, libsse.NewMessage("", string(b), event))
	})

	_ = r.Run(":8080")
}
