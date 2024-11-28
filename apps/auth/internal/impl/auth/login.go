package auth

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"golang.org/x/crypto/bcrypt"
)

func (h Auth) Login(ctx context.Context, req *proto.LoginRequest) (*proto.LoginResponse, error) {
	var user models.User
	checkUserQuery := squirrel.Select("*").From(models.User{}.TableName()).Where(squirrel.Eq{"login": req.Login, "t_deleted": false}).PlaceholderFormat(squirrel.Dollar)
	err := checkUserQuery.RunWith(h.DB).QueryRow().Scan(&user.Id, &user.Login, &user.Password, &user.Email, &user.TCreatedAt, &user.TUpdatedAt, &user.TDeleted)
	if err != nil {
		h.Logger.Error("Login error while checking user")
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		h.Logger.Error("Error while checking password matching")
		return nil, err
	}

	session := models.NewSession(user)
	err = h.Redis.HSet(ctx, "session:"+session.Id, user).Err()
	if err != nil {
		h.Logger.Error("Error while creating session")
		return nil, err
	}
	err = h.Redis.ExpireAt(ctx, "session:"+session.Id, session.ExpiredAt).Err()
	if err != nil {
		h.Logger.Error("Error while set expiration time for session")
		h.Redis.Del(ctx, "session:"+session.Id)

		return nil, err
	}

	return &proto.LoginResponse{SessionId: session.Id}, nil

}
