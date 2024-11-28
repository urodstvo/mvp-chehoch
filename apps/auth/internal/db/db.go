package db

import (
	"context"
	"database/sql"
	"os"

	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/config"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/logger"

	"github.com/jackc/pgx/v5/pgxpool"
	stdlib "github.com/jackc/pgx/v5/stdlib"
)

func New(logger logger.Logger, config config.Config) *sql.DB {
	pool, err := pgxpool.New(context.Background(), config.DATABASE_URL)
	if err != nil {
		logger.Error("failed to open database: " + err.Error())
		os.Exit(1)
	}

	db := stdlib.OpenDBFromPool(pool)

	return db
}
