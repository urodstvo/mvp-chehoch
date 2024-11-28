package tags

import (
	"context"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/helpers"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"

	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
)

func (h *Tags) AddTagsToUser(ctx context.Context, req *proto.AddTagsToUserRequest) (*emptypb.Empty, error) {
	user, err := helpers.GetUserFromContext(ctx)
	if err != nil {
		h.Logger.Error("Error while getting user")
		return nil, err
	}

	addTagsQuery := squirrel.Insert(models.ProfilesTags{}.TableName()).Columns("profile_id", "tag_id").PlaceholderFormat(squirrel.Dollar)

	for _, tag_id := range req.Tags {
		addTagsQuery = addTagsQuery.Values(user.Id, tag_id)
	}
	_, err = addTagsQuery.RunWith(h.DB).ExecContext(ctx)
	if err != nil {
		h.Logger.Error("Error while adding tags to user")
		return nil, err
	}
	return &emptypb.Empty{}, nil
}
