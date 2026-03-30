package main

import (
	_ "embed"
	"encoding/json"
	libsse "github.com/alexandrevicenzi/go-sse"
	"github.com/gin-gonic/gin"
	"github.com/samber/lo"
	sloggin "github.com/samber/slog-gin"
	"io"
	"log"
	"log/slog"
	"net/http"
	"strings"
	"sync"
	"time"
)
import "github.com/gin-contrib/cors"

type controlLock struct {
	mu       sync.Mutex
	Holder   string    `json:"holder"`
	Since    time.Time `json:"since"`
	Acquired bool      `json:"acquired"`
}

var lock controlLock

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

	broadcastLock := func() {
		lock.mu.Lock()
		snapshot := struct {
			Holder   string    `json:"holder"`
			Since    time.Time `json:"since"`
			Acquired bool      `json:"acquired"`
		}{lock.Holder, lock.Since, lock.Acquired}
		lock.mu.Unlock()

		payload, _ := json.Marshal(snapshot)
		sse.SendMessage(defaultChannel, libsse.NewMessage("", string(payload), "control-lock"))
	}

	r.GET("/control/status", func(c *gin.Context) {
		lock.mu.Lock()
		defer lock.mu.Unlock()
		c.JSON(http.StatusOK, gin.H{
			"holder":   lock.Holder,
			"since":    lock.Since,
			"acquired": lock.Acquired,
		})
	})

	r.POST("/control/acquire", func(c *gin.Context) {
		var body struct {
			Holder string `json:"holder"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON", "details": err.Error()})
			return
		}
		if body.Holder == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "holder name is required"})
			return
		}

		lock.mu.Lock()
		lock.Holder = body.Holder
		lock.Since = time.Now()
		lock.Acquired = true
		lock.mu.Unlock()

		slog.InfoContext(c, "control acquired", "holder", body.Holder)
		broadcastLock()
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	r.POST("/control/release", func(c *gin.Context) {
		lock.mu.Lock()
		lock.Holder = ""
		lock.Since = time.Time{}
		lock.Acquired = false
		lock.mu.Unlock()

		slog.InfoContext(c, "control released")
		broadcastLock()
		c.JSON(http.StatusOK, gin.H{"ok": true})
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
