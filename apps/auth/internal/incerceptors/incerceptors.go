package incerceptors

import (
	"database/sql"

	"github.com/redis/go-redis/v9"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/logger"
)

type Incerceptor struct {
	redis  *redis.Client
	db     *sql.DB
	logger logger.Logger
}

func New(db *sql.DB, l logger.Logger, redis *redis.Client) *Incerceptor {
	return &Incerceptor{
		logger: l,
		db:     db,
		redis:  redis,
	}
}
