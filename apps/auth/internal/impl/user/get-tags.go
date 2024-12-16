package user

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/helpers"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (h *User) GetUserTags(ctx context.Context, req *emptypb.Empty) (*proto.GetUserTagsResponse, error) {
	user, err := helpers.GetUserFromContext(ctx)
	if err != nil {
		h.Logger.Error("Error while getting user")
		return nil, err
	}
	getUserTagsQuery := squirrel.Select("t.*").From(models.ProfilesTags{}.TableName() + " pt").Join(models.Tag{}.TableName() + " t ON t.id = pt.tag_id").
		Where(squirrel.Eq{"pt.profile_id": user.Id, "t.t_deleted": false, "pt.t_deleted": false}).PlaceholderFormat(squirrel.Dollar)

	var wrapper []*proto.Tag

	rows, err := getUserTagsQuery.RunWith(h.DB).QueryContext(ctx)
	if err != nil {
		h.Logger.Error("Error while getting user tags")
		return nil, err
	}

	for rows.Next() {
		var tag models.Tag
		err = rows.Scan(&tag.Id, &tag.Name, &tag.TCreatedAt, &tag.TUpdatedAt, &tag.TDeleted)
		if err != nil {
			h.Logger.Error("Error while scaning tag")
			return nil, err
		}
		wrapper = append(wrapper, &proto.Tag{
			Id:         tag.Id,
			Name:       tag.Name,
			TCreatedAt: timestamppb.New(tag.TCreatedAt),
			TUpdatedAt: timestamppb.New(tag.TUpdatedAt),
			TDeleted:   tag.TDeleted,
		})
	}

	return &proto.GetUserTagsResponse{Tags: wrapper}, nil

}
