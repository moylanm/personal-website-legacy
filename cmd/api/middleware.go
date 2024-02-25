package main

import (
	"context"
	"fmt"
	"net/http"
	"runtime/debug"
	"strings"
	"sync"
	"time"

	"github.com/justinas/nosurf"
	"github.com/mileusna/useragent"
	"github.com/tomasen/realip"
	"golang.org/x/time/rate"

	"mylesmoylan.net/internal/data"
)

func secureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var unsafeInline string

		if strings.HasPrefix(r.URL.Path, "/dashboard") {
			unsafeInline = "'unsafe-inline'"
		} else {
			unsafeInline = ""
		}

		w.Header().Set("Content-Security-Policy",
			fmt.Sprintf("default-src 'self'; connect-src 'self' https://www.mylesmoylan.net https://mylesmoylan.net; object-src 'none'; style-src 'self' %s fonts.googleapis.com; font-src fonts.gstatic.com", unsafeInline))

		w.Header().Set("Strict-Transport-Security", "31536000")
		w.Header().Set("Referrer-Policy", "origin-when-cross-origin")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "deny")
		w.Header().Set("X-XSS-Protection", "0")

		next.ServeHTTP(w, r)
	})
}

func noSurf(next http.Handler) http.Handler {
	csrfHandler := nosurf.New(next)
	csrfHandler.SetBaseCookie(http.Cookie{
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
	})

	return csrfHandler
}

func (app *application) recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				app.logError(r, fmt.Errorf("%s", debug.Stack()))

				w.Header().Set("Connection", "close")
				app.serverErrorResponse(w, r, fmt.Errorf("%s", err))
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

func (app *application) requireAuthentication(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !app.isAuthenticated(r) {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		w.Header().Add("Cache-Control", "no-store")

		next.ServeHTTP(w, r)
	})
}

func (app *application) authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := app.sessionManager.GetInt(r.Context(), "authenticatedUserID")
		if id == 0 {
			next.ServeHTTP(w, r)
			return
		}

		exists, err := app.models.Users.Exists(id)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}

		if exists {
			ctx := context.WithValue(r.Context(), isAuthenticatedContextKey, true)
			r = r.WithContext(ctx)
		}

		next.ServeHTTP(w, r)
	})
}

func (app *application) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Origin")

		origin := r.Header.Get("Origin")

		if origin != "" {
			for i := range app.config.Cors.TrustedOrigins {
				if origin == app.config.Cors.TrustedOrigins[i] {
					w.Header().Set("Access-Control-Allow-Origin", origin)
					break
				}
			}
		}

		next.ServeHTTP(w, r)
	})
}

func (app *application) logRequests(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !app.isAuthenticated(r) {
			ua := useragent.Parse(r.Header.Get("User-Agent"))

			var deviceType string

			switch {
			case ua.Mobile:
				deviceType = "Mobile"
			case ua.Tablet:
				deviceType = "Tablet"
			case ua.Desktop:
				deviceType = "Desktop"
			case ua.Bot:
				deviceType = "Bot"
			default:
				deviceType = "Unknown"
			}

			request := &data.Request{
				Method:       r.Method,
				Path:         r.URL.Path,
				IpAddress:    realip.FromRequest(r),
				Referer:      r.Header.Get("Referer"),
				UAName:       ua.Name,
				UAOS:         ua.OS,
				UADeviceType: deviceType,
				UADeviceName: ua.Device,
				TimeStamp:    time.Now(),
			}

			if err := app.models.Requests.Insert(request); err != nil {
				app.logError(r, err)
			}
		}

		next.ServeHTTP(w, r)
	})
}
