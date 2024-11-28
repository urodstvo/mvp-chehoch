package impl_deps

import (
	"database/sql"

	"github.com/redis/go-redis/v9"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/config"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/logger"
)

type ImplDeps struct {
	DB     *sql.DB
	Redis  *redis.Client
	Logger logger.Logger
	Config config.Config
}
