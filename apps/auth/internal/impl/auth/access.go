package auth

import (
	"context"
	"fmt"

	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/incerceptors"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
)

func (h *Auth) CheckAccess(ctx context.Context, req *proto.CheckAccessRequest) (*proto.CheckAccessResponse, error) {
	_, ok := ctx.Value(incerceptors.UserIncerceptorKey).(models.User)
	if !ok {
		return &proto.CheckAccessResponse{Allowed: false}, fmt.Errorf("Forbidden")
	}

	return &proto.CheckAccessResponse{Allowed: true}, nil

}
