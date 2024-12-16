package user

import (
	"context"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/helpers"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (h *User) DeleteUser(ctx context.Context, _ *emptypb.Empty) (*emptypb.Empty, error) {
	user, err := helpers.GetUserFromContext(ctx)
	if err != nil {
		h.Logger.Error("Error while getting user")
		return nil, err
	}

	deleteUserQuery := squirrel.Update(models.User{}.TableName()).SetMap(squirrel.Eq{"t_deleted": true, "t_updated_at": time.Now()}).Where(squirrel.Eq{"id": user.Id}).PlaceholderFormat(squirrel.Dollar)
	_, err = deleteUserQuery.RunWith(h.DB).ExecContext(ctx)
	if err != nil {
		h.Logger.Error("Error while deleting user")
		return nil, err
	}

	return &emptypb.Empty{}, nil
}
