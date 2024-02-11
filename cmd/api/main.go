package main

import (
	"context"
	"flag"
	"html/template"
	"log/slog"
	"os"
	"time"

	"github.com/alexedwards/scs/postgresstore"
	"github.com/alexedwards/scs/v2"
	"github.com/go-playground/form/v4"
	"mylesmoylan.net/internal/data"
)

type application struct {
	config         config
	logger         *slog.Logger
	models         data.Models
	templateCache  map[string]*template.Template
	formDecoder    *form.Decoder
	sessionManager *scs.SessionManager
	limiterCancel  context.CancelFunc
}

func main() {
	var cfgPath string

	flag.StringVar(&cfgPath, "config-path", "config.yaml", "Configuration file path")

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	cfg, err := readConfig(cfgPath)
	if err != nil {
		logger.Error("failed to read config: ", err)
		os.Exit(1)
	}

	db, err := openDB(cfg)
	if err != nil {
		logger.Error("failed to open database connection: ", err)
		os.Exit(1)
	}
	defer db.Close()

	logger.Info("database connection pool established")

	templateCache, err := newTemplateCache()
	if err != nil {
		logger.Error("failed to create template cache: ", err)
		os.Exit(1)
	}

	sessionManager := scs.New()
	sessionManager.Store = postgresstore.New(db)
	sessionManager.IdleTimeout = 20 * time.Minute
	sessionManager.Lifetime = 12 * time.Hour

	app := &application{
		config:         cfg,
		logger:         logger,
		models:         data.NewModels(db),
		templateCache:  templateCache,
		formDecoder:    form.NewDecoder(),
		sessionManager: sessionManager,
	}

	if err = app.serve(); err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
}
