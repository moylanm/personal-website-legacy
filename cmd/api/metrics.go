package main

import (
	"database/sql"
	"expvar"
	"runtime"
	"time"
)

var startTime time.Time

func publishMetrics(db *sql.DB) {
	expvar.Publish("uptime", expvar.Func(func() any {
		uptime := time.Since(startTime)
		return uptime.Round(time.Second).String()
	}))

	expvar.Publish("goroutines", expvar.Func(func() any {
		return runtime.NumGoroutine()
	}))

	expvar.Publish("database", expvar.Func(func() any {
		return db.Stats()
	}))
}
