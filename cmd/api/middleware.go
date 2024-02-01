package main

import (
	"context"
	"crypto/subtle"
	"fmt"
	"net/http"
	"runtime/debug"
	"sync"
	"time"

	"github.com/tomasen/realip"
	"golang.org/x/time/rate"
)

func (app *application) recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				trace := fmt.Sprintf("%s\n%s", err, debug.Stack())
				app.logError(r, fmt.Errorf("%s", trace))

				w.Header().Set("Connection", "close")
				app.serverErrorResponse(w, r, fmt.Errorf("a server error occurred"))
			}
		}()

		next.ServeHTTP(w, r)
	})
}

func (app *application) rateLimit(next http.Handler) http.Handler {
	type client struct {
		limiter  *rate.Limiter
		lastSeen time.Time
	}

	var (
		mu      sync.Mutex
		clients = make(map[string]*client)
		ticker  = time.NewTicker(time.Minute)
	)

	ctx, cancel := context.WithCancel(context.Background())
	app.limiterCancel = cancel

	go func() {
		for {
			select {
			case <-ticker.C:
				mu.Lock()

				for ip, client := range clients {
					if time.Since(client.lastSeen) > 3*time.Minute {
						delete(clients, ip)
					}
				}

				mu.Unlock()
			case <-ctx.Done():
				ticker.Stop()
				return
			}
		}
	}()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if app.config.Limiter.Enabled {
			ip := realip.FromRequest(r)

			mu.Lock()

			if _, found := clients[ip]; !found {
				clients[ip] = &client{
					limiter: rate.NewLimiter(rate.Limit(app.config.Limiter.Rps), app.config.Limiter.Burst),
				}
			}

			clients[ip].lastSeen = time.Now()

			if !clients[ip].limiter.Allow() {
				mu.Unlock()
				app.rateLimitExceededResponse(w, r)
				return
			}

			mu.Unlock()
		}

		next.ServeHTTP(w, r)
	})
}

func (app *application) authenticate(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		username, password, ok := r.BasicAuth()

		if !ok ||
			subtle.ConstantTimeCompare([]byte(app.config.Admin.Username), []byte(username)) != 1 ||
			subtle.ConstantTimeCompare([]byte(app.config.Admin.Password), []byte(password)) != 1 {
			app.invalidCredentialsResponse(w, r)
			return
		}

		next.ServeHTTP(w, r)
	})
}
