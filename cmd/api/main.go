package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"html/template"
	"log/slog"
	"os"
	"time"

	vault "github.com/hashicorp/vault/api"
	_ "github.com/lib/pq"
	"gopkg.in/yaml.v3"
	"mylesmoylan.net/internal/data"
)

type config struct {
	Host string `yaml:"host"`
	Port int    `yaml:"port"`
	Db   struct {
		Dsn          string        `yaml:"dsn"`
		MaxOpenConns int           `yaml:"maxOpenConns"`
		MaxIdleConns int           `yaml:"maxIdleConns"`
		MaxIdleTime  time.Duration `yaml:"maxIdleTime"`
	} `yaml:"db"`
	Limiter struct {
		Rps     float64 `yaml:"rps"`
		Burst   int     `yaml:"burst"`
		Enabled bool    `yaml:"enabled"`
	} `yaml:"limiter"`
	Admin struct {
		Username     string `yaml:"username"`
		PasswordHash string `yaml:"passwordHash"`
	} `yaml:"admin"`
}

type application struct {
	config        config
	logger        *slog.Logger
	models        data.Models
	templateCache map[string]*template.Template
	limiterCancel context.CancelFunc
}

func readConfig(path string) (config, error) {
	var cfg config

	data, err := os.ReadFile(path)
	if err != nil {
		return config{}, err
	}

	err = yaml.Unmarshal(data, &cfg)
	if err != nil {
		return config{}, err
	}

	overrideConfigWithEnv(&cfg)

	return cfg, nil
}

func overrideConfigWithEnv(cfg *config) {
	dsnPassword, err := getDatabasePasswordFromVault()
	if err != nil {
		fmt.Println("Error getting password from Vault:", err)
		return
	}
	cfg.Db.Dsn = fmt.Sprintf("postgres://myles:%s@localhost/website", dsnPassword)

	if username := os.Getenv("WEBSITE_USERNAME"); username != "" {
		cfg.Admin.Username = username
	}

	if passwordHash := os.Getenv("WEBSITE_PASSWORD_HASH"); passwordHash != "" {
		cfg.Admin.PasswordHash = passwordHash
	}
}

func validateConfig(cfg *config) error {
	// Validate DB configuration
	if cfg.Db.Dsn == "" {
		return fmt.Errorf("database DSN is required")
	}
	if cfg.Db.MaxOpenConns <= 0 {
		return fmt.Errorf("max open connections must be positive")
	}
	if cfg.Db.MaxIdleConns <= 0 {
		return fmt.Errorf("max idle connections must be positive")
	}
	if cfg.Db.MaxIdleTime <= 0 {
		return fmt.Errorf("max idle time must be positive")
	}

	// Validate server configuration
	if cfg.Host != "" && cfg.Host != "localhost" {
		return fmt.Errorf("invalid hostname")
	}
	if cfg.Port < 1024 || cfg.Port > 65535 {
		return fmt.Errorf("port must be between 1024 and 65535")
	}

	// Validate admin credentials
	if cfg.Admin.Username == "" || cfg.Admin.PasswordHash == "" {
		return fmt.Errorf("admin username and password hash are required")
	}

	// Validate limiter configuration if enabled
	if cfg.Limiter.Enabled {
		if cfg.Limiter.Rps <= 0 {
			return fmt.Errorf("rate limiter RPS must be positive")
		}
		if cfg.Limiter.Burst <= 0 {
			return fmt.Errorf("rate limiter burst must be positive")
		}
	}

	return nil
}

func getDatabasePasswordFromVault() (string, error) {
	config := vault.DefaultConfig()
	client, err := vault.NewClient(config)
	if err != nil {
		return "", fmt.Errorf("error creating Vault client: %w", err)
	}

	client.SetToken(os.Getenv("VAULT_TOKEN"))

	secret, err := client.Logical().Read("kv/website")
	if err != nil {
		return "", fmt.Errorf("error reading secret from Vault: %w", err)
	}
	if secret == nil || secret.Data["DSN_PASSWORD"] == nil {
		return "", fmt.Errorf("password not found in Vault")
	}

	password, ok := secret.Data["DSN_PASSWORD"].(string)
	if !ok {
		return "", fmt.Errorf("password is not a string")
	}

	return password, nil
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

func main() {
	var cfgPath string

	flag.StringVar(&cfgPath, "config-path", "config.yaml", "Configuration file path")

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	cfg, err := readConfig(cfgPath)
	if err != nil {
		logger.Error(err.Error())
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
