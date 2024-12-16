package session

import (
	"context"
	"fmt"
	"time"

	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (h *Session) RefreshSession(ctx context.Context, req *emptypb.Empty) (*emptypb.Empty, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, fmt.Errorf("Empty metadata")
	}
	session_id := md["session_id"][0]

	err := h.Redis.ExpireAt(ctx, "session:"+session_id, time.Now().Add(time.Hour*24*7)).Err()
	if err != nil {
		h.Logger.Error("Error while refreshing session")
		return nil, err
	}

	return &emptypb.Empty{}, nil
}
