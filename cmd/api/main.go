package main

import (
	"context"
	"database/sql"
	"flag"
	"html/template"
	"log/slog"
	"os"
	"time"

	_ "github.com/lib/pq"
	"mylesmoylan.net/internal/data"
)


type application struct {
	config        config
	logger        *slog.Logger
	models        data.Models
	templateCache map[string]*template.Template
	limiterCancel context.CancelFunc
}

func main() {
	var cfgPath string

	flag.StringVar(&cfgPath, "config-path", "config.yaml", "Configuration file path")

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	cfg, err := readConfig(cfgPath)
	if err != nil {
		logger.Error("Failed to read config: ", err)
		os.Exit(1)
	}

	if err = validateConfig(&cfg); err != nil {
		logger.Error("Invalid configuration: " + err.Error())
		os.Exit(1)
	}

	db, err := openDB(cfg)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
	defer db.Close()

	logger.Info("database connection pool established")

	templateCache, err := newTemplateCache()
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	app := &application{
		config:        cfg,
		logger:        logger,
		models:        data.NewModels(db),
		templateCache: templateCache,
	}

	if err = app.serve(); err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
}

func openDB(cfg config) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.Db.Dsn)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(cfg.Db.MaxOpenConns)
	db.SetMaxIdleConns(cfg.Db.MaxIdleConns)
	db.SetConnMaxIdleTime(cfg.Db.MaxIdleTime)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		return nil, err
	}

	return db, nil
}
