package app

import (
	"context"
	"database/sql"
	"log/slog"
	"net"

	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/config"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/db"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/impl"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/incerceptors"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/logger"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/redis"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"

	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"go.uber.org/fx"
	"google.golang.org/grpc"

	r "github.com/redis/go-redis/v9"
)

var App = fx.Options(
	fx.Provide(
		config.NewFx,
		logger.NewFx,
		db.New,
		incerceptors.New,
		redis.New,
		impl.New,
	),
	fx.Invoke(
		func(
			l logger.Logger,
			lc fx.Lifecycle,
			impl impl.Impl,
			db *sql.DB,
			inc *incerceptors.Incerceptor,
			redis *r.Client,
		) error {
			grpcNetListener, err := net.Listen("tcp", "0.0.0.0:8002")
			if err != nil {
				l.Error(err.Error())
				return err
			}

			grpcServer := grpc.NewServer(grpc.StatsHandler(otelgrpc.NewServerHandler()), grpc.UnaryInterceptor(inc.UserContextInterceptor))

			proto.RegisterAuthServer(grpcServer, impl)

			lc.Append(
				fx.Hook{
					OnStart: func(_ context.Context) error {
						l.Info("Running AUTH SERVICE", slog.String("port", "8002"))
						go func() {
							if err := grpcServer.Serve(grpcNetListener); err != nil {
								l.Error("Failed to start gRPC server", slog.String("error", err.Error()))
							}
						}()
						return nil
					},
					OnStop: func(_ context.Context) error {
						l.Info("Stopping AUTH SERVICE...")
						redis.Close()
						db.Close()
						grpcServer.GracefulStop()
						return nil
					},
				},
			)

			return nil
		},
	),
)
