package helpers

import (
	"context"
	"fmt"

	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/incerceptors"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	"google.golang.org/grpc/metadata"
)

func GetUserFromContext(ctx context.Context) (*models.User, error) {
	user, ok := ctx.Value(incerceptors.UserIncerceptorKey).(models.User)
	if !ok {
		md, ok := metadata.FromIncomingContext(ctx)
		if !ok {
			return nil, fmt.Errorf("Empty metadata")
		}
		return nil, fmt.Errorf("No active session with id=%s", md["session_id"][0])
	}

	return &user, nil
}
