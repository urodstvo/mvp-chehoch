package redis

import (
	"encoding/gob"

	"github.com/redis/go-redis/v9"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/config"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
)

func New(config config.Config) *redis.Client {
	gob.Register(models.User{})

	return redis.NewClient(&redis.Options{Addr: config.REDIS_URL,
		Password: "",
		DB:       0,
	})
}
