package app

import (
	"context"
	"net"

	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/config"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/impl"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/logger"
	"github.com/urodstvo/mvp-chehoch/apps/auth/proto"

	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"go.uber.org/fx"
	"google.golang.org/grpc"
)

var App = fx.Options(
	fx.Provide(
		config.NewFx,
		logger.NewFx(
			logger.Opts{},
		),
		impl.New,
	),
	fx.Invoke(
		func(
			l logger.Logger,
			lc fx.Lifecycle,
			impl impl.Impl,
		) error {
			grpcNetListener, err := net.Listen("tcp", "0.0.0.0:8002")
			if err != nil {
				l.Error(err.Error())
				return err
			}
			grpcServer := grpc.NewServer(grpc.StatsHandler(otelgrpc.NewServerHandler()))

			proto.RegisterAuthServer(grpcServer, impl)

			lc.Append(
				fx.Hook{
					OnStart: func(_ context.Context) error {
						go grpcServer.Serve(grpcNetListener)
						l.Info("Auth server is running")
						return nil
					},
					OnStop: func(ctx context.Context) error {
						grpcServer.GracefulStop()
						return nil
					},
				},
			)

			return nil
		},
	),
)
