package user

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

func (h *User) GetUsers(ctx context.Context, req *proto.GetUsersRequest) (*proto.GetUsersResponse, error) {
	var users []*proto.UserWithProfile

	getUsersQuery := squirrel.Select("*").From(models.User{}.TableName() + " u").Join(models.Profile{}.TableName() + " p ON u.id = p.id").Where(squirrel.Eq{"u.id": req.UserIds, "u.t_deleted": false}).PlaceholderFormat(squirrel.Dollar)
	rows, err := getUsersQuery.RunWith(h.DB).QueryContext(ctx)
	if err != nil {
		h.Logger.Error("Error while getting users")
		return nil, err
	}

	for rows.Next() {
		var user models.User
		var profile models.Profile
		err = rows.Scan(&user.Id, &user.Login, &user.Password, &user.Email, &user.TCreatedAt, &user.TUpdatedAt, &user.TDeleted, &profile.Id, &profile.Proffession, &profile.BirthDate, &profile.MaritalStatus, &profile.EducationLevel, &profile.Avatar)
		if err != nil {
			h.Logger.Error("Error while scaning users")
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

		users = append(users, &wrapper)
	}

	return &proto.GetUsersResponse{Users: users}, nil
}
