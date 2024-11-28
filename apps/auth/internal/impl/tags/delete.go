package tags

import (
	"context"
	"time"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/helpers"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"

	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
)

func (h *Tags) DeleteTagsFromUser(ctx context.Context, req *proto.DeleteTagsFromUserRequest) (*emptypb.Empty, error) {
	user, err := helpers.GetUserFromContext(ctx)
	if err != nil {
		h.Logger.Error("Error while getting user")
		return nil, err
	}

	deleteTagsQuery := squirrel.Update(models.ProfilesTags{}.TableName()).Where(squirrel.Eq{"profile_id": user.Id, "tag_id": req.Tags}).Set("t_deleted", true).Set("t_updated_at", time.Now()).PlaceholderFormat(squirrel.Dollar)
	_, err = deleteTagsQuery.RunWith(h.DB).ExecContext(ctx)
	if err != nil {
		h.Logger.Error("Error while deleting tags from user")
		return nil, err
	}

	return &emptypb.Empty{}, nil
}
