package config

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	DATABASE_URL string `required:"true"                       envconfig:"DATABASE_URL"`
	REDIS_URL    string `required:"true"                       envconfig:"REDIS_URL"`
	APP_ENV      string `required:"true" default:"development" envconfig:"APP_ENV"`
}

func NewWithEnvPath(envPath string) (*Config, error) {
	var newCfg Config
	_ = godotenv.Load(envPath)

	if err := envconfig.Process("", &newCfg); err != nil {
		return nil, err
	}

	return &newCfg, nil
}

func New() (*Config, error) {
	wd, err := os.Getwd()
	if err != nil {
		return nil, err
	}

	if strings.HasPrefix(wd, "/app") {
		wd = "/app"
	} else {
		for !strings.HasSuffix(wd, "mvp-chehoch") {
			wd = filepath.Join(wd, "..")
		}
	}

	envPath := filepath.Join(wd, ".env")

	return NewWithEnvPath(envPath)
}

func NewFx() Config {
	config, err := New()
	if err != nil {
		panic(err)
	}

	return *config
}

func NewFxWithPath(path string) Config {
	config, err := NewWithEnvPath(path)
	if err != nil {
		panic(err)
	}

	return *config
}
