package main

import (
	"context"
	"embed"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
	"github.com/pressly/goose/v3"
)

//
//go:embed sql/*.sql
var embedMigrations embed.FS

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		panic("failed to load config: " + err.Error())
	}

	pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		panic("failed to open database: " + err.Error())
	}

	db := stdlib.OpenDBFromPool(pool)

	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("postgres"); err != nil {
		panic(err)
	}

	if err := goose.Up(db, "sql", goose.WithAllowMissing()); err != nil {
		panic(err)
	}
	// if err := goose.DownTo(db, "sql", 20241030142542, goose.WithAllowMissing()); err != nil {
	// 	panic(err)
	// }

}
