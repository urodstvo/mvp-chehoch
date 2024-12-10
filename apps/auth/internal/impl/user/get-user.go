package user

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

func (h *User) GetUser(ctx context.Context, req *proto.GetUserRequest) (*proto.GetUserResponse, error) {
	getUserQuery := squirrel.Select("*").From(models.User{}.TableName()).Where(squirrel.Eq{"id": req.UserId, "t_deleted": false}).PlaceholderFormat(squirrel.Dollar)

	var user models.User
	err := getUserQuery.RunWith(h.DB).QueryRowContext(ctx).Scan(&user.Id, &user.Login, &user.Password, &user.Email, &user.TCreatedAt, &user.TUpdatedAt, &user.TDeleted)
	if err != nil {
		h.Logger.Error("Error while getting user")
		return nil, err
	}

	getProfileQuery := squirrel.Select("*").From(models.Profile{}.TableName()).Where(squirrel.Eq{"id": user.Id}).PlaceholderFormat(squirrel.Dollar)

	var profile models.Profile
	err = getProfileQuery.RunWith(h.DB).QueryRowContext(ctx).Scan(&profile.Id, &profile.Proffession, &profile.BirthDate, &profile.MaritalStatus, &profile.EducationLevel, &profile.Avatar)
	if err != nil {
		h.Logger.Error("Error while getting profile")
		return nil, err
	}

	wrapper := proto.UserWithProfile{
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

	return &proto.GetUserResponse{User: &wrapper}, nil

}
