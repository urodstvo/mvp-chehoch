package session

import (
	"context"
	"log/slog"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/helpers"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

func (h *Session) GetUserFromSession(ctx context.Context, _ *emptypb.Empty) (*proto.GetUserFromSessionResponse, error) {
	user, err := helpers.GetUserFromContext(ctx)
	if err != nil {
		h.Logger.Error("Error while getting user from context", slog.String("error", err.Error()))
		return nil, err
	}

	// h.Logger.Info("Get user from session", slog.Any("user", user))

	getProfileQuery := squirrel.Select("*").From(models.Profile{}.TableName()).Where(squirrel.Eq{"id": user.Id}).PlaceholderFormat(squirrel.Dollar)

	var profile models.Profile
	err = getProfileQuery.RunWith(h.DB).QueryRowContext(ctx).Scan(&profile.Id, &profile.Proffession, &profile.BirthDate, &profile.MaritalStatus, &profile.EducationLevel, &profile.Avatar)
	if err != nil {
		h.Logger.Error("Error while getting profile")
		return nil, err
	}

	wrapper := &proto.UserWithProfile{
		Id:         user.Id,
		Login:      user.Login,
		Email:      user.Email,
		TCreatedAt: timestamppb.New(user.TCreatedAt),
		TUpdatedAt: timestamppb.New(user.TUpdatedAt),
		TDeleted:   user.TDeleted,
	}

	if profile.Proffession.Valid {
		wrapper.Proffession = &wrapperspb.StringValue{Value: profile.Proffession.String}
	}

	if profile.BirthDate.Valid {
		wrapper.BirthDate = timestamppb.New(profile.BirthDate.Time)
	}

	// if profile.EducationLevel.Valid {
	// 	wrapper.EducationLevel = &proto.UserWithProfile_Level{Level: proto.EducationLevel(profile.EducationLevel.Int32)}
	// } else {
	// 	wrapper.EducationLevel = &proto.UserWithProfile_NoLevel{NoLevel: &emptypb.Empty{}}
	// }

	// if profile.MaritalStatus.Valid {
	// 	wrapper.MaritalStatus = &proto.UserWithProfile_Status{Status: proto.MaritalStatus(profile.MaritalStatus.Int32)}
	// } else {
	// 	wrapper.MaritalStatus = &proto.UserWithProfile_NoStatus{NoStatus: &emptypb.Empty{}}
	// }

	return &proto.GetUserFromSessionResponse{User: wrapper}, nil
}
