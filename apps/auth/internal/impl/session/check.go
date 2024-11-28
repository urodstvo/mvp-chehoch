package session

import (
	"context"
	"fmt"

	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (h *Session) CheckSession(ctx context.Context, _ *emptypb.Empty) (*proto.CheckSessionResponse, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, fmt.Errorf("Empty metadata")
	}
	session_id := md["session_id"][0]

	m, err := h.Redis.HGetAll(ctx, "session:"+session_id).Result()
	if err != nil || len(m) == 0 {
		return nil, fmt.Errorf("No active session with id=%s", session_id)
	}

	return &proto.CheckSessionResponse{Valid: true}, nil
}
