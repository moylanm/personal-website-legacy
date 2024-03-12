package main

import (
	"database/sql"
	"expvar"
	"runtime"
)

func publishMetrics(db *sql.DB) {
	expvar.Publish("goroutines", expvar.Func(func() any {
		return runtime.NumGoroutine()
	}))

	expvar.Publish("database", expvar.Func(func() any {
		return db.Stats()
	}))
}
