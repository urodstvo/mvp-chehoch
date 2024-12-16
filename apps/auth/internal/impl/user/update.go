package user

import (
	"context"
	"fmt"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/helpers"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (h *User) UpdateUser(ctx context.Context, req *proto.UpdateUserRequest) (*emptypb.Empty, error) {
	u, err := helpers.GetUserFromContext(ctx)
	if err != nil {
		h.Logger.Error("Error while getting user")
		return nil, err
	}

	tx, err := h.DB.Begin()
	if err != nil {
		h.Logger.Error("Error while starting transaction")
		return nil, err
	}
	defer tx.Rollback()

	getUserQuery := squirrel.Select("*").From(models.User{}.TableName() + " u").Join(models.Profile{}.TableName() + " p ON u.id = p.id").Where(squirrel.Eq{"u.id": u.Id, "u.t_deleted": false}).PlaceholderFormat(squirrel.Dollar)

	var user models.User
	var profile models.Profile
	err = getUserQuery.RunWith(tx).QueryRowContext(ctx).Scan(&user.Id, &user.Login, &user.Password, &user.Email, &user.TCreatedAt, &user.TUpdatedAt, &user.TDeleted, &profile.Id, &profile.Proffession, &profile.BirthDate, &profile.MaritalStatus, &profile.EducationLevel, &profile.Avatar)
	if err != nil {
		h.Logger.Error("Error while getting user")
		return nil, err
	}

	if req.Login != nil {
		user.Login = *req.Login
	}

	if req.Email != nil {
		user.Email = *req.Email
	}

	var BirthDate *time.Time
	var Proffession *string
	var EducationLevel *int32
	var MaritalStatus *int32

	if req.BirthDate != nil {
		time := req.BirthDate.AsTime()
		BirthDate = &time
	} else {
		if profile.BirthDate.Valid {
			BirthDate = &profile.BirthDate.Time
		}
	}

	if req.Proffession != nil {
		Proffession = req.Proffession
	} else {
		if profile.Proffession.Valid {
			Proffession = &profile.Proffession.String
		}
	}

	if req.EducationLevel != nil {
		*EducationLevel = int32(*req.EducationLevel)
	} else {
		if profile.EducationLevel.Valid {
			EducationLevel = &profile.EducationLevel.Int32
		}
	}

	if req.MaritalStatus != nil {
		*MaritalStatus = int32(*req.MaritalStatus)
	} else {
		if profile.MaritalStatus.Valid {
			MaritalStatus = &profile.MaritalStatus.Int32
		}
	}

	updateUserQuery := squirrel.Update(models.User{}.TableName()).SetMap(squirrel.Eq{
		"login":        user.Login,
		"email":        user.Email,
		"t_updated_at": time.Now(),
	}).Where(squirrel.Eq{"id": u.Id, "t_deleted": false}).PlaceholderFormat(squirrel.Dollar)
	_, err = updateUserQuery.RunWith(tx).ExecContext(ctx)
	if err != nil {
		h.Logger.Error("Error while updating user")
		return nil, err
	}

	updateProfileQuery := squirrel.Update(models.Profile{}.TableName()).SetMap(squirrel.Eq{
		"profession":      Proffession,
		"birth_date":      BirthDate,
		"marital_status":  MaritalStatus,
		"education_level": EducationLevel,
	}).Where(squirrel.Eq{"id": u.Id}).PlaceholderFormat(squirrel.Dollar)
	_, err = updateProfileQuery.RunWith(tx).ExecContext(ctx)
	if err != nil {
		h.Logger.Error("Error while updating profile")
		return nil, err
	}

	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, fmt.Errorf("Empty metadata")
	}

	// Обновляем данные в Redis
	err = h.Redis.HSet(ctx, "session:"+md["session_id"][0], user).Err()
	if err != nil {
		h.Logger.Error("Error while updating session in Redis", "error", err)
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		h.Logger.Error("Error while committing transaction")
		return nil, err
	}

	return &emptypb.Empty{}, nil

}
