package main

import (
	"fmt"
	"os"
	"time"

	vault "github.com/hashicorp/vault/api"
	"gopkg.in/yaml.v3"
)

type config struct {
	Host    string `yaml:"host"`
	Port    int    `yaml:"port"`
	TLSCert string `yaml:"tlsCert"`
	TLSKey  string `yaml:"tlsKey"`
	Db      struct {
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
	Cors struct {
		TrustedOrigins []string `yaml:"trustedOrigins"`
	} `yaml:"cors"`
}

const dsnTemplate = "postgres://myles:%s@localhost/website?sslmode=require"

func readConfig(path string) (config, error) {
	var cfg config

	data, err := os.ReadFile(path)
	if err != nil {
		return config{}, fmt.Errorf("failed to read config file (%s): %w", path, err)
	}

	if err = yaml.Unmarshal(data, &cfg); err != nil {
		return config{}, fmt.Errorf("failed to unmarshal YAML: %w", err)
	}

	cfg.Db.Dsn = fmt.Sprintf(dsnTemplate, os.Getenv("DB_PASSWORD"))

	if err = validateConfig(&cfg); err != nil {
		return config{}, fmt.Errorf("invalid configuration: %w", err)
	}

	return cfg, nil
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
	if secret == nil || secret.Data["DB_PASSWORD"] == nil {
		return "", fmt.Errorf("password not found in Vault")
	}

	password, ok := secret.Data["DB_PASSWORD"].(string)
	if !ok {
		return "", fmt.Errorf("password is not a string")
	}

	return password, nil
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

	// Validate CORS configuration
	if len(cfg.Cors.TrustedOrigins) == 0 {
		return fmt.Errorf("CORS trusted origins must be provided")
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
