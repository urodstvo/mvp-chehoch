package main

import (
	"github.com/urodstvo/mvp-chehoch/apps/auth/app"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/logger"
	"go.uber.org/fx"
)

func main() {
	fx.New(
		logger.FxDiOnlyErrors,
		app.App,
	).Run()
}
