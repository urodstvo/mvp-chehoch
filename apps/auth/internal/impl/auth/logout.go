package auth

import (
	"context"
	"fmt"

	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (h *Auth) Logout(ctx context.Context, _ *emptypb.Empty) (*emptypb.Empty, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, fmt.Errorf("Empty metadata")
	}
	session_id := md["session_id"][0]

	err := h.Redis.Del(ctx, "session:"+session_id).Err()
	if err != nil {
		h.Logger.Error("Error while logout")
		return nil, err
	}

	return &emptypb.Empty{}, nil
}
