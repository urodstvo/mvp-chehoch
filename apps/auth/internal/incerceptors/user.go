package incerceptors

import (
	"context"

	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

func (s *Incerceptor) UserContextInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if ok {
		sessionIDs := md.Get("session_id")
		if len(sessionIDs) > 0 {
			var user models.User
			err := s.redis.HGetAll(ctx, "session:"+sessionIDs[0]).Scan(&user)
			if err != nil {
				s.logger.Error("Failed to get session data from Redis:", err)
			}
			ctx = context.WithValue(ctx, UserIncerceptorKey, user)
		}

	}

	return handler(ctx, req)
}
